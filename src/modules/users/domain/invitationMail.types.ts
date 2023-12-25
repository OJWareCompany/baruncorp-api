import { InvitationEmails } from '@prisma/client'

/**
 * For Entity
 * Entity
 * RequestDTO -> CommandDTO (convert in Controller) -> Entity (convert in Service) -> Persistence (convert in Repository)
 *                                                                                      Mapper convert Entity to Model
 * Entity를 컨트롤러나 영속성과 상관없이 만드는건가
 * Entity전용 Create Prop은.. ReqDTO랑 다르니까
 */

export interface CreateInvitationMailProp {
  email: string
  role: string
  organizationId: string
}

export type InvitationEmailProp = CreateInvitationMailProp
