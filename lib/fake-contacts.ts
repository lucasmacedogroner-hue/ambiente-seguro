export interface SidebarContact {
  id: string
  name: string
  avatarUrl: string
  preview: string
  time: string
  unread?: number
  isActive?: boolean
  isCurrentRoom?: boolean
}

const FEMALE_FIRST = [
  'Ana', 'Carla', 'Elena', 'Gabriela', 'Isabela', 'Karina', 'Mariana',
  'Olivia', 'Rafaela', 'Tatiana', 'Beatriz', 'Camila', 'Juliana', 'Patricia',
]

const MALE_FIRST = [
  'Bruno', 'Diego', 'Felipe', 'Henrique', 'João', 'Lucas', 'Nicolas', 'Pedro',
  'Samuel', 'Vitor', 'André', 'Carlos', 'Marcos', 'Ricardo', 'Thiago',
]

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Ferreira', 'Rodrigues',
  'Almeida', 'Nascimento', 'Araujo', 'Ribeiro', 'Carvalho', 'Gomes', 'Martins', 'Rocha',
]

const PREVIEWS = [
  'Ok, combinado 👍',
  'Vou verificar e te aviso',
  'Pode ser às 15h?',
  'Obrigado!',
  'Enviei o arquivo',
  'Precisamos alinhar isso',
  'Perfeito, até logo',
  'Você viu a mensagem?',
  'Sim, estou de acordo',
  'Te chamo depois',
]

const TIMES = ['09:12', '10:45', 'Ontem', 'Seg', '08:30', '12:01', 'Ontem', '11:20']

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return Math.abs(h)
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

function isFemaleFirstName(first: string): boolean {
  const normalized = first.normalize('NFD').replace(/\p{M}/gu, '')
  return FEMALE_FIRST.some(
    (n) => n.normalize('NFD').replace(/\p{M}/gu, '') === normalized
  )
}

/** Retratos com gênero coerente ao nome (randomuser.me) */
function portraitUrl(
  roomId: string,
  key: string,
  female: boolean
): string {
  const idx = hash(`${roomId}-${key}`) % 99
  return female
    ? `https://randomuser.me/api/portraits/women/${idx}.jpg`
    : `https://randomuser.me/api/portraits/men/${idx}.jpg`
}

function avatarForName(roomId: string, name: string, key: string): string {
  const first = firstName(name)
  const female = isFemaleFirstName(first)
  return portraitUrl(roomId, `${key}-${first}`, female)
}

export function buildSidebarContacts(
  roomId: string,
  participants: string[],
  roomLabel: string
): SidebarContact[] {
  const seed = hash(roomId)

  const real: SidebarContact[] = participants.map((name, i) => ({
    id: `real-${name}`,
    name,
    avatarUrl: avatarForName(roomId, name, `real-${i}`),
    preview: i === 0 ? 'Sala ativa agora' : 'Participante na sala',
    time: 'Agora',
    isActive: true,
    isCurrentRoom: name === roomLabel || i === 0,
  }))

  const decoyCount = 10
  const decoys: SidebarContact[] = Array.from({ length: decoyCount }, (_, i) => {
    const s = seed + i * 17
    const useFemale = i % 2 === 0
    const first = pick(useFemale ? FEMALE_FIRST : MALE_FIRST, s)
    const last = pick(LAST_NAMES, s + 3)
    const name = `${first} ${last}`
    return {
      id: `decoy-${i}`,
      name,
      avatarUrl: portraitUrl(roomId, `decoy-${i}-${first}`, useFemale),
      preview: pick(PREVIEWS, s + 7),
      time: pick(TIMES, s + 11),
      unread: s % 4 === 0 ? (s % 9) + 1 : undefined,
    }
  })

  const roomEntry: SidebarContact = {
    id: 'current-room',
    name: roomLabel,
    avatarUrl: portraitUrl(roomId, 'room', false),
    preview: '● Conversa em andamento',
    time: 'Agora',
    isActive: true,
    isCurrentRoom: true,
  }

  return [roomEntry, ...real.filter((r) => r.name !== roomLabel), ...decoys]
}
