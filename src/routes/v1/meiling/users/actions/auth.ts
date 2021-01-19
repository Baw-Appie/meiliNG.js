import { FastifyRequest, FastifyReply } from 'fastify';
import { isMeilingV1UserActionPermitted, MeilingV1UserActionsParams } from '.';
import { prisma } from '../../../../..';
import { getOAuth2ClientByClientId, isClientAccessible } from '../../../../../common/client';
import { getAllUserInfo } from '../../../../../common/user';
import { sendMeilingError } from '../../error';
import { MeilingV1ErrorType } from '../../interfaces';

type MeilingV1UserOAuthAuthParams = MeilingV1UserActionsParams;

interface MeilingV1UserOAuthAuthQuery {
  clientId: string;
  scope: string;
}

export async function meilingV1OAuthApplicationAuthCheckHandler(req: FastifyRequest, rep: FastifyReply) {
  const params = req.params as MeilingV1UserOAuthAuthParams;
  const query = req.query as MeilingV1UserOAuthAuthQuery;

  const userBase = await isMeilingV1UserActionPermitted(req);
  if (userBase === undefined) {
    sendMeilingError(rep, MeilingV1ErrorType.INVALID_REQUEST, 'invalid request.');
    return;
  } else if (userBase === null) {
    sendMeilingError(rep, MeilingV1ErrorType.UNAUTHORIZED, 'you are not logged in as specified user.');
    return;
  }

  const userData = await getAllUserInfo(userBase);

  if (!query.clientId) {
    sendMeilingError(
      rep,
      MeilingV1ErrorType.APPLICATION_NOT_FOUND,
      'oAuth2 application with specified client_id does not exist',
    );
    return;
  }

  const client = await getOAuth2ClientByClientId(query.clientId);
  if (client === null) {
    sendMeilingError(
      rep,
      MeilingV1ErrorType.APPLICATION_NOT_FOUND,
      'oAuth2 application with specified client_id does not exist',
    );
    return;
  }

  const permissionCheck = await isClientAccessible(query.clientId, userBase);
  if (!permissionCheck) {
    sendMeilingError(rep, MeilingV1ErrorType.UNAUTHORIZED, 'specified oAuth2 application is inaccessible');
    return;
  }

  if (userData?.authorizedApps) {
    rep.send({
      authorized: true,
    });
  } else {
    rep.send({
      authorized: false,
    });
  }
}
