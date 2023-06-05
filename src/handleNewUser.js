import { readKv, writeKv } from "./cfUtilities";
import { OWNER_ACTION_GRANT_PERMISSION, USER_ACTION_REQUEST_PERMISSION } from "./constants/callbackConstants";
import { sendMessageToTelegramUser } from "./telegram";

const markupWithButtonForPermissionRequest = {
  inline_keyboard: [
    [{
      text: "Request permission",
      callback_data: USER_ACTION_REQUEST_PERMISSION,
    }],
  ],
};

export const sendMessageToNewUserWhoNeedsPermission = async ({ token, chatId }) => {
  return await sendMessageToTelegramUser({
    token,
    chatId,
    text: "Permission required.",
    replyMarkup: markupWithButtonForPermissionRequest,
  });
};


const markupWithButtonToGrantPermission = ({ requestedBy }) => ({
  inline_keyboard: [
    [{
      text: "Grant Permission",
      callback_data: `${OWNER_ACTION_GRANT_PERMISSION}_DATA:${requestedBy}`,
    }],
  ],
});

export const handlePermissionRequest = async ({ token, ownerId, payload }) => {
  const { callback_query } = payload;
  const { id, first_name, username } = callback_query.from;
  const permissionRequestMessageToBotOwner = `${first_name} ${username} with the id: ${id} is asking for permission.`;

  const replyMarkup = markupWithButtonToGrantPermission({ requestedBy: id });

  return await sendMessageToTelegramUser({
    token,
    chatId: ownerId,
    text: permissionRequestMessageToBotOwner,
    replyMarkup,
  });
};

export const activateNewUser = async ({
  userIdOfNewUser,
  accountIdentifier,
  kvNamespace,
  apiToken,
}) => {
  const kvProps = { accountIdentifier, kvNamespace, apiToken, key: "users" };
  const users = await readKv({ ...kvProps }) || [];

  if (!users.includes(userIdOfNewUser)) {
    users.push(userIdOfNewUser);
    await writeKv({ value: users, ...kvProps });
  }
}
