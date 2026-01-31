import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { settingsApi } from "@/api/endpoints/settings"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import toast from "react-hot-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import { ROUTES } from "@/lib/constants"

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState<Record<string, any>>({})

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.getSettings(),
    onSuccess: (data) => {
      const settingsMap: Record<string, any> = {}
      data.forEach((setting) => {
        settingsMap[setting.key] = setting.value
      })
      setSettings(settingsMap)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { key: string; value: any }) =>
      settingsApi.updateSetting(data.key, { value: data.value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      toast.success("Ayar güncellendi")
    },
    onError: () => {
      toast.error("Ayar güncellenirken hata oluştu")
    },
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  const handleSave = (key: string) => {
    updateMutation.mutate({ key, value: settings[key] })
  }

  if (isLoading) {
    return <div className="p-6">Yükleniyor...</div>
  }

  const groupedSettings = data?.reduce((acc, setting) => {
    const category = setting.category || "Genel"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(setting)
    return acc
  }, {} as Record<string, typeof data>)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
        <p className="text-muted-foreground mt-2">
          Platform ayarlarını yönetin
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="cancellation">İptal Politikası</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {groupedSettings &&
            Object.entries(groupedSettings).map(([category, categorySettings]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySettings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Label htmlFor={setting.key}>{setting.key}</Label>
                          {setting.description && (
                            <p className="text-sm text-muted-foreground">
                              {setting.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {typeof setting.value === "boolean" ? (
                            <input
                              type="checkbox"
                              id={setting.key}
                              checked={settings[setting.key] ?? setting.value}
                              onChange={(e) =>
                                handleSettingChange(setting.key, e.target.checked)
                              }
                              className="h-4 w-4"
                            />
                          ) : typeof setting.value === "number" ? (
                            <Input
                              id={setting.key}
                              type="number"
                              value={settings[setting.key] ?? setting.value}
                              onChange={(e) =>
                                handleSettingChange(
                                  setting.key,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-32"
                            />
                          ) : (
                            <Input
                              id={setting.key}
                              value={settings[setting.key] ?? setting.value}
                              onChange={(e) =>
                                handleSettingChange(setting.key, e.target.value)
                              }
                              className="w-64"
                            />
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleSave(setting.key)}
                            disabled={updateMutation.isPending}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="cancellation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>İptal ve Ceza Politikası</CardTitle>
              <CardDescription>
                İptal kurallarını ve ceza oranlarını yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link to={ROUTES.CANCELLATION_POLICY}>
                  <Button variant="outline" className="w-full">
                    İptal Politikası Yönetimi
                  </Button>
                </Link>
                <Link to={ROUTES.CANCELLATION_HISTORY}>
                  <Button variant="outline" className="w-full">
                    İptal Geçmişi
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
