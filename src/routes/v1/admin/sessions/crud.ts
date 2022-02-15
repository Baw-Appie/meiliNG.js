import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Meiling } from '../../../../common';
import { getPrismaClient } from '../../../../resources/prisma';

const sessionAdminHandler = (app: FastifyInstance, opts: FastifyPluginOptions, done: () => void): void => {
  app.addHook('onRequest', async (req, rep) => {
    const token = (req.query as { token: string }).token;
    if (!token || token.trim() === '') {
      throw new Meiling.V1.Error.MeilingError(Meiling.V1.Error.ErrorType.INVALID_REQUEST, 'Invalid query');
    }

    const tokenData = await getPrismaClient().meilingSessionV1Token.findFirst({
      where: {
        token,
      },
    });

    if (!tokenData) {
      throw new Meiling.V1.Error.MeilingError(Meiling.V1.Error.ErrorType.NOT_FOUND, 'Session was not found');
    }
  });

  app.put('/', async (req, rep) => {
    const token = (req.query as { token: string }).token;
    const body = req.body as any | undefined;

    const tokenDataOld = await getPrismaClient().meilingSessionV1Token.findFirst({
      where: {
        token,
      },
    });

    if (!tokenDataOld) {
      throw new Meiling.V1.Error.MeilingError(Meiling.V1.Error.ErrorType.NOT_FOUND, 'Session was not found');
    }

    if (body?.ip) {
      await getPrismaClient().meilingSessionV1Token.update({
        where: {
          token,
        },
        data: {
          ip: body.ip,
        },
      });
    }

    if (body?.lastUsed) {
      await getPrismaClient().meilingSessionV1Token.update({
        where: {
          token,
        },
        data: {
          lastUsed: body.lastUsed,
        },
      });
    }

    if (body?.session) {
      await getPrismaClient().meilingSessionV1Token.update({
        where: {
          token,
        },
        data: {
          session: body.session,
        },
      });
    }

    const tokenData = await getPrismaClient().meilingSessionV1Token.findFirst({
      where: {
        token,
      },
    });

    rep.send(tokenData);
  });

  app.delete('/', async (req, rep) => {
    const token = (req.query as { token: string }).token;

    await getPrismaClient().meilingSessionV1Token.delete({
      where: {
        token,
      },
    });

    rep.send({ success: true });
  });

  done();
};

export default sessionAdminHandler;
