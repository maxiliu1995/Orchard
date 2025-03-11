import { setupServer } from 'msw/browser'
import { handlers } from './handlers'

export const server = setupServer(...handlers)