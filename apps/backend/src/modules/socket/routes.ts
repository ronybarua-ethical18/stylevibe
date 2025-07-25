import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { router } from '../../utils/typedRouter';
import { ConversationController } from './controllers/conversation.controller';
import { ConversationZodSchema } from './validations/conversation.validation';
import { MessageController } from './controllers/message.controller';
import { MessageZodSchema } from './validations/message.validation';

// Conversation routes
router.post(
  '/conversations/find',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  validateRequest(ConversationZodSchema.createConversationZodSchema),
  ConversationController.createConversation
);

router.get(
  '/conversations/:userId',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  validateRequest(MessageZodSchema.createMessageZodSchema),
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
  '/messages/:conversationId',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  MessageController.getMessages
);

router.patch(
  '/messages/:conversationId/seen',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  MessageController.updateMessageStatus
);

export const SocketIORoutes = router;
