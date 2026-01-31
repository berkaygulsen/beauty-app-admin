import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CustomerDetail } from "@/api/endpoints/customers"

interface CustomerAddressesProps {
  customer: CustomerDetail
}

export function CustomerAddresses({ customer }: CustomerAddressesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresler</CardTitle>
      </CardHeader>
      <CardContent>
        {customer.addresses && customer.addresses.length > 0 ? (
          <div className="space-y-4">
            {customer.addresses.map((address) => (
              <div
                key={address.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {address.city} / {address.district}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.addressLine}
                    </p>
                  </div>
                  {address.isDefault && (
                    <Badge variant="default">Varsayılan</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Henüz adres eklenmemiş</p>
        )}
      </CardContent>
    </Card>
  )
}
