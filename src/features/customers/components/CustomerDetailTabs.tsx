import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { CustomerDetail } from "@/api/endpoints/customers"
import { CustomerGeneralInfo } from "./CustomerGeneralInfo"
import { CustomerAddresses } from "./CustomerAddresses"
import { CustomerServiceRequests } from "./CustomerServiceRequests"
import { CustomerPayments } from "./CustomerPayments"
import { CustomerReviews } from "./CustomerReviews"

interface CustomerDetailTabsProps {
  customer: CustomerDetail
}

export function CustomerDetailTabs({ customer }: CustomerDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
        <TabsTrigger value="addresses">Adresler</TabsTrigger>
        <TabsTrigger value="requests">Hizmet Talepleri</TabsTrigger>
        <TabsTrigger value="payments">Ödemeler</TabsTrigger>
        <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-4">
        <CustomerGeneralInfo customer={customer} />
      </TabsContent>

      <TabsContent value="addresses" className="mt-4">
        <CustomerAddresses customer={customer} />
      </TabsContent>

      <TabsContent value="requests" className="mt-4">
        <CustomerServiceRequests customer={customer} />
      </TabsContent>

      <TabsContent value="payments" className="mt-4">
        <CustomerPayments customer={customer} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-4">
        <CustomerReviews customer={customer} />
      </TabsContent>
    </Tabs>
  )
}
