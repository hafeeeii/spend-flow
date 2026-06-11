import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Bottlenecks() {
  return (
    <Card className="border-border shadow-2xs bg-card text-card-foreground transition-colors duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold text-foreground">Approval Bottlenecks</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">Real-time alerts on pending workflow delays.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Bottleneck 1 */}
        <div className="flex items-start space-x-3 p-3 bg-muted/40 border border-border rounded-lg">
          <Avatar className="h-7 w-7">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Marcus Chen" />
            <AvatarFallback className="text-xs font-bold">MC</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">Marcus Chen (CFO)</p>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">Holding 1 high-value request</p>
            <div className="flex items-center space-x-2 mt-2.5">
              <span className="text-xs font-bold bg-destructive/10 text-destructive border-none px-1.5 py-0.5 rounded-md hover:bg-destructive/20">
                SLA Exceeded
              </span>
              <span className="text-xs text-muted-foreground font-bold">Pending 3.4 days</span>
            </div>
          </div>
        </div>

        {/* Bottleneck 2 */}
        <div className="flex items-start space-x-3 p-3 bg-muted/40 border border-border rounded-lg">
          <Avatar className="h-7 w-7">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Alex Rivera" />
            <AvatarFallback className="text-xs font-bold">AR</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">Alex Rivera (Design Mgr)</p>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">Holding 1 hardware request</p>
            <div className="flex items-center space-x-2 mt-2.5">
              <span className="text-xs font-bold bg-primary/10 text-primary border-none px-1.5 py-0.5 rounded-md hover:bg-primary/20">
                Action Required
              </span>
              <span className="text-xs text-muted-foreground font-bold">Pending 1.1 days</span>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
