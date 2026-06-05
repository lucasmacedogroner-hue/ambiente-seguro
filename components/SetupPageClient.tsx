'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppNav } from '@/components/app-nav'
import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserPlan, setUserPlan, type UserPlan } from '@/lib/plan'
import { ArrowLeft } from 'lucide-react'

export function SetupPageClient() {
  const [plan, setPlan] = useState<UserPlan>('free')

  useEffect(() => {
    setPlan(getUserPlan())
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      <header
        className="border-b border-[var(--border-color)]"
        style={{ backgroundColor: 'var(--bg-header)' }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <AppLogo size={40} />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Área de testes
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Simule o plano Premium antes da assinatura real
              </p>
              <AppNav />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-lg flex-1 space-y-6 px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="text-[var(--text-primary)]">
          <Link href="/">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar ao início
          </Link>
        </Button>

        <Card className="border-[var(--border-color)] bg-[var(--bg-sidebar)]">
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">
              Testar plano Premium
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Ative o Premium só no seu navegador para testar skins, duração e
              opções travadas. Pagamento real ainda não está integrado.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant={plan === 'free' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setUserPlan('free')
                setPlan('free')
              }}
              className={
                plan === 'free'
                  ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                  : 'border-[var(--border-color)] text-[var(--text-primary)]'
              }
            >
              Gratuito
            </Button>
            <Button
              variant={plan === 'premium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setUserPlan('premium')
                setPlan('premium')
              }}
              className={
                plan === 'premium'
                  ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                  : 'border-[var(--border-color)] text-[var(--text-primary)]'
              }
            >
              Premium (teste)
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Depois de escolher, volte à{' '}
          <Link href="/" className="font-medium text-[var(--accent)] underline underline-offset-2">
            página inicial
          </Link>{' '}
          e abra o menu de skins para ver as opções liberadas.
        </p>
      </main>
    </div>
  )
}
