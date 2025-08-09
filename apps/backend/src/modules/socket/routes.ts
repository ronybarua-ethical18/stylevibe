import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { createRouter } from '../../utils/typedRouter';
import { ConversationController } from './controllers/conversation.controller';
import { createConversationValidation } from './validations/conversation.validation';
import { MessageController } from './controllers/message.controller';
import { MessageZodSchema } from './validations/message.validation';

const router = createRouter();

// Conversation routes
router.post(
  '/conversations/find',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  validateRequest(createConversationValidation),
  ConversationController.createConversation
);

router.get(
  '/conversations/:userId',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  ConversationController.getAllConversations
);

// Message routes
router.post(
  '/messages',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  validateRequest(MessageZodSchema.createMessageZodSchema),
  MessageController.createMessage
);

router.get(
  '/messages',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  MessageController.getMessagesByParticipants
);

router.get(
  '/messages/:conversationId',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  validateRequest(MessageZodSchema.getMessagesZodSchema),
  MessageController.getMessages
);

router.patch(
  '/messages/:conversationId/seen',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  MessageController.updateMessageStatus
);

export const SocketIORoutes = router;
