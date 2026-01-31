import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DocumentDetail, DocumentVerificationHistoryItem } from "@/api/endpoints/documents"
import {
  getDocumentStatusBadgeVariant,
  getDocumentStatusLabel,
  formatFileSize,
} from "@/lib/utils/document"
import { formatDateTime } from "@/lib/utils/status"
import { Download } from "lucide-react"
import toast from "react-hot-toast"

interface DocumentDetailContentProps {
  document: DocumentDetail
}

export function DocumentDetailContent({
  document: doc,
}: DocumentDetailContentProps) {
  const navigate = useNavigate()
  const fileUrl = doc.fileUrl ?? doc.documentUrl
  const fileName = doc.fileName ?? "document"
  const status = doc.verificationStatus
  const docType = doc.documentType
  const providerName =
    doc.providerName ??
    (doc.provider
      ? [doc.provider.firstName, doc.provider.lastName].filter(Boolean).join(" ")
      : "")
  const uploadedAt = doc.uploadedAt ?? doc.createdAt

  const handleDownload = async () => {
    try {
      const { documentsApi } = await import("@/api/endpoints/documents")
      const result = await documentsApi.downloadDocument(doc.id)
      const url = "documentUrl" in result ? result.documentUrl : String(result)
      const a = globalThis.document.createElement("a")
      a.href = url
      a.download = fileName
      a.target = "_blank"
      globalThis.document.body.appendChild(a)
      a.click()
      globalThis.document.body.removeChild(a)
      toast.success("Doküman indirildi")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(
        err.response?.data?.message || "Doküman indirme başarısız oldu"
      )
    }
  }

  const handlePreview = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank")
    }
  }

  return (
    <div className="space-y-6">
      {/* Document Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Doküman Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Durum:</span>
              <div className="mt-1">
                <Badge
                  variant={getDocumentStatusBadgeVariant(status)}
                  className="text-lg px-4 py-2"
                >
                  {getDocumentStatusLabel(status)}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tür:</span>
              <p className="font-medium">{docType}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Provider:</span>
              <p className="font-medium">
                <button
                  className="text-primary hover:underline"
                  onClick={() =>
                    navigate(`/providers/${doc.providerId}`)
                  }
                >
                  {providerName}
                </button>
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Yüklenme Tarihi:
              </span>
              <p className="font-medium">
                {uploadedAt ? formatDateTime(uploadedAt) : "-"}
              </p>
            </div>
            {doc.verifiedAt && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Doğrulama Tarihi:
                </span>
                <p className="font-medium">
                  {formatDateTime(doc.verifiedAt)}
                </p>
              </div>
            )}
            {doc.verifiedBy && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Doğrulayan:
                </span>
                <p className="font-medium">{doc.verifiedBy}</p>
              </div>
            )}
            {doc.rejectionReason && (
              <div>
                <span className="text-sm text-muted-foreground">Red Sebebi:</span>
                <p className="font-medium text-destructive">
                  {doc.rejectionReason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dosya Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Dosya Adı:</span>
              <p className="font-medium">{fileName}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Dosya Boyutu:</span>
              <p className="font-medium">{doc.fileSize != null ? formatFileSize(doc.fileSize) : "-"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">MIME Type:</span>
              <p className="font-medium">{doc.mimeType ?? "-"}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex-1 gap-2"
              >
                <Download className="h-4 w-4" />
                İndir
              </Button>
              {fileUrl && (
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  className="flex-1"
                >
                  Önizle
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Preview */}
      {fileUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Doküman Önizleme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              {doc.mimeType?.startsWith("image/") ? (
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="w-full h-auto"
                />
              ) : doc.mimeType === "application/pdf" ? (
                <iframe
                  src={fileUrl}
                  className="w-full h-[600px]"
                  title={fileName}
                />
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Bu dosya türü için önizleme mevcut değil. Lütfen indirerek
                  görüntüleyin.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification History */}
      {doc.verificationHistory &&
        doc.verificationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Doğrulama Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doc.verificationHistory.map((history: DocumentVerificationHistoryItem) => (
                  <div
                    key={history.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{history.status}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(history.verifiedAt ?? history.changedAt)}
                        </span>
                      </div>
                      {(history.verifiedBy ?? history.changedBy) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Doğrulayan: {history.verifiedBy ?? history.changedBy}
                        </p>
                      )}
                      {history.reason && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Sebep: {history.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
