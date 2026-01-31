import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProviderDetail } from "@/api/endpoints/providers"
import { ProviderGeneralInfo } from "./ProviderGeneralInfo"
import { ProviderServices } from "./ProviderServices"
import { ProviderServiceRequests } from "./ProviderServiceRequests"
import { ProviderPayments } from "./ProviderPayments"
import { ProviderDocuments } from "./ProviderDocuments"
import { ProviderRatings } from "./ProviderRatings"
import { ProviderActivityLog } from "./ProviderActivityLog"

interface ProviderDetailTabsProps {
  provider: ProviderDetail
}

export function ProviderDetailTabs({ provider }: ProviderDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
        <TabsTrigger value="services">Hizmetler</TabsTrigger>
        <TabsTrigger value="requests">Hizmet Talepleri</TabsTrigger>
        <TabsTrigger value="payments">Ödemeler</TabsTrigger>
        <TabsTrigger value="documents">Dokümanlar</TabsTrigger>
        <TabsTrigger value="ratings">Puanlama</TabsTrigger>
        <TabsTrigger value="activity">Aktivite Logu</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-4">
        <ProviderGeneralInfo provider={provider} />
      </TabsContent>

      <TabsContent value="services" className="mt-4">
        <ProviderServices provider={provider} />
      </TabsContent>

      <TabsContent value="requests" className="mt-4">
        <ProviderServiceRequests provider={provider} />
      </TabsContent>

      <TabsContent value="payments" className="mt-4">
        <ProviderPayments provider={provider} />
      </TabsContent>

      <TabsContent value="documents" className="mt-4">
        <ProviderDocuments provider={provider} />
      </TabsContent>

      <TabsContent value="ratings" className="mt-4">
        <ProviderRatings provider={provider} />
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <ProviderActivityLog provider={provider} />
      </TabsContent>
    </Tabs>
  )
}
