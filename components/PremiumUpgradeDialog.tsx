'use client'

import { Lock, Sparkles, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PREMIUM_PRICE } from '@/lib/plan'

interface PremiumUpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureTitle?: string
}

export function PremiumUpgradeDialog({
  open,
  onOpenChange,
  featureTitle,
}: PremiumUpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            Recurso Premium
          </DialogTitle>
          <DialogDescription>
            {featureTitle
              ? `“${featureTitle}” faz parte do plano pago.`
              : 'Este recurso faz parte do plano pago.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            No plano <strong className="text-foreground">gratuito</strong> você usa o Ambiente
            Seguro <strong className="text-foreground">sem criar conta</strong>: basta entrar na
            sala com seu nome. Isso já é seguro e anônimo.
          </p>
          <p className="text-muted-foreground">
            Para desbloquear opções extras, será necessário{' '}
            <strong className="text-foreground">criar uma conta</strong> ou{' '}
            <strong className="text-foreground">assinar o Premium</strong> ({PREMIUM_PRICE}).
          </p>

          <ul className="rounded-lg border bg-muted/40 p-3 space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              Várias salas ativas ao mesmo tempo
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              Duração da sala de 1h a 24h
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              Todas as skins visuais
            </li>
          </ul>

          <p className="text-xs text-muted-foreground">
            Pagamento e cadastro serão integrados em breve. Por enquanto os recursos premium
            aparecem travados para você saber o que está incluído.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="flex-1 gap-2" disabled title="Em breve">
            <UserPlus className="h-4 w-4" />
            Criar conta
          </Button>
          <Button className="flex-1 gap-2" disabled title="Em breve">
            <Lock className="h-4 w-4" />
            Assinar {PREMIUM_PRICE}
          </Button>
        </div>
        <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
          Continuar no plano gratuito
        </Button>
      </DialogContent>
    </Dialog>
  )
}
