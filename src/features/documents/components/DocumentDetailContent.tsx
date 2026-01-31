import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DocumentDetail } from "@/api/endpoints/documents"
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
  document,
}: DocumentDetailContentProps) {
  const navigate = useNavigate()

  const handleDownload = async () => {
    try {
      const { documentsApi } = await import("@/api/endpoints/documents")
      const blob = await documentsApi.downloadDocument(document.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = document.fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Doküman indirildi")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(
        err.response?.data?.message || "Doküman indirme başarısız oldu"
      )
    }
  }

  const handlePreview = () => {
    if (document.fileUrl) {
      window.open(document.fileUrl, "_blank")
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
                  variant={getDocumentStatusBadgeVariant(document.status)}
                  className="text-lg px-4 py-2"
                >
                  {getDocumentStatusLabel(document.status)}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tür:</span>
              <p className="font-medium">{document.type}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Provider:</span>
              <p className="font-medium">
                <button
                  className="text-primary hover:underline"
                  onClick={() =>
                    navigate(`/providers/${document.providerId}`)
                  }
                >
                  {document.providerName}
                </button>
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Yüklenme Tarihi:
              </span>
              <p className="font-medium">
                {formatDateTime(document.uploadedAt)}
              </p>
            </div>
            {document.verifiedAt && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Doğrulama Tarihi:
                </span>
                <p className="font-medium">
                  {formatDateTime(document.verifiedAt)}
                </p>
              </div>
            )}
            {document.verifiedBy && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Doğrulayan:
                </span>
                <p className="font-medium">{document.verifiedBy}</p>
              </div>
            )}
            {document.rejectionReason && (
              <div>
                <span className="text-sm text-muted-foreground">Red Sebebi:</span>
                <p className="font-medium text-destructive">
                  {document.rejectionReason}
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
              <p className="font-medium">{document.fileName}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Dosya Boyutu:</span>
              <p className="font-medium">{formatFileSize(document.fileSize)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">MIME Type:</span>
              <p className="font-medium">{document.mimeType}</p>
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
              {document.fileUrl && (
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
      {document.fileUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Doküman Önizleme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              {document.mimeType.startsWith("image/") ? (
                <img
                  src={document.fileUrl}
                  alt={document.fileName}
                  className="w-full h-auto"
                />
              ) : document.mimeType === "application/pdf" ? (
                <iframe
                  src={document.fileUrl}
                  className="w-full h-[600px]"
                  title={document.fileName}
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
      {document.verificationHistory &&
        document.verificationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Doğrulama Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {document.verificationHistory.map((history) => (
                  <div
                    key={history.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{history.status}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(history.verifiedAt)}
                        </span>
                      </div>
                      {history.verifiedBy && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Doğrulayan: {history.verifiedBy}
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
