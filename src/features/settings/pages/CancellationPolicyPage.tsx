import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { settingsApi } from "@/api/endpoints/settings"
import type { CancellationPolicy, UpdateCancellationPolicyRequest } from "@/api/endpoints/settings"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save } from "lucide-react"
import toast from "react-hot-toast"

export default function CancellationPolicyPage() {
  const queryClient = useQueryClient()
  const [policies, setPolicies] = useState<CancellationPolicy[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ["cancellation-policy"],
    queryFn: () => settingsApi.getCancellationPolicy(),
  })

  useEffect(() => {
    if (data) setPolicies(data)
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCancellationPolicyRequest) =>
      settingsApi.updateCancellationPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancellation-policy"] })
      toast.success("İptal politikası güncellendi")
    },
    onError: () => {
      toast.error("İptal politikası güncellenirken hata oluştu")
    },
  })

  const handleAddPolicy = () => {
    setPolicies([
      ...policies,
      {
        id: `new-${Date.now()}`,
        hoursBeforeService: 24,
        refundPercentage: 100,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }

  const handleRemovePolicy = (id: string) => {
    setPolicies(policies.filter((p) => p.id !== id))
  }

  const handleUpdatePolicy = (
    id: string,
    field: keyof CancellationPolicy,
    value: number | boolean
  ) => {
    setPolicies(
      policies.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    )
  }

  const handleSave = () => {
    const request: UpdateCancellationPolicyRequest = {
      policies: policies.map((p) => ({
        hoursBeforeService: p.hoursBeforeService,
        refundPercentage: p.refundPercentage,
        isActive: p.isActive,
      })),
    }
    updateMutation.mutate(request)
  }

  if (isLoading) {
    return <div className="p-6">Yükleniyor...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">İptal ve Ceza Politikası</h1>
        <p className="text-muted-foreground mt-2">
          Hizmet iptal kurallarını ve ceza oranlarını yapılandırın
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İptal Kuralları</CardTitle>
          <CardDescription>
            Hizmetten kaç saat önce iptal edilirse ne kadar iade yapılacağını belirleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="flex items-end gap-4 p-4 border rounded-lg"
            >
              <div className="flex-1">
                <Label>Hizmetten Önceki Saat</Label>
                <Input
                  type="number"
                  min="0"
                  value={policy.hoursBeforeService}
                  onChange={(e) =>
                    handleUpdatePolicy(
                      policy.id,
                      "hoursBeforeService",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="flex-1">
                <Label>İade Yüzdesi (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={policy.refundPercentage}
                  onChange={(e) =>
                    handleUpdatePolicy(
                      policy.id,
                      "refundPercentage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={policy.isActive}
                  onChange={(e) =>
                    handleUpdatePolicy(policy.id, "isActive", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <Label>Aktif</Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemovePolicy(policy.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-4">
            <Button onClick={handleAddPolicy} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kural Ekle
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kural Açıklaması</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              Kurallar yukarıdan aşağıya doğru kontrol edilir ve ilk eşleşen kural uygulanır
            </li>
            <li>
              Örneğin: 24 saat önce iptal → %100 iade, 12 saat önce iptal → %50 iade
            </li>
            <li>
              Aktif olmayan kurallar uygulanmaz
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
