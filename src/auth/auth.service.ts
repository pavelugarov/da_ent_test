import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'src/db/repositories/auth.repository';
import { Repository } from 'src/enums';
import { uuidv4 } from 'src/utils';
import { User, UserEntity } from './enities/user.entry';
import { Session } from './enities/session.entry';
import { Tokens } from './enities/token.entry';
import { isPhoneNumber, isEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

export const accessTokenSecret = 'accessTokenSecret';
export const accessTokenExpirationTime = '10m';
export const refreshTokenSecret = 'refreshTokenSecret';
export const refreshTokenExpirationTime = '1d';
const SALT_OR_ROUNDS = 12;


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(Repository.AUTH)
    private readonly authRepository: AuthRepository,
  ) { }

  async signIn(login: string, password: string, sessionId?: string) {
    if (!isPhoneNumber(login)) {
      if (!isEmail(login))
        throw new BadRequestException('id must be a phone number or email');
    }

    const user = await this.authRepository.findUserByCredintals(login, password);
    if (!user) throw new UnauthorizedException();

    let userSession: Session | null = null;
    if (sessionId) userSession = await this.getUserSession(user.id, sessionId);
    
    const tokens = await this.getTokens(user.id, userSession );
    return tokens;
  }

  async signInNewToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: refreshTokenSecret,
    });

    const userSession = await this.getUserSession(+payload.userId, payload.sessionId);
    if (!userSession) {
      throw new UnauthorizedException();
    }

    const tokens = await this.getTokens(userSession.userId, userSession);

    

    return tokens;
  }

  async signUp(login: string, password: string) {
    if (!isPhoneNumber(login)) {
      if (!isEmail(login))
        throw new BadRequestException('id must be a phone number or email');
    }

    const existUser = await this.authRepository.findUserByLogin(login);
    if (existUser) throw new BadRequestException('User already exists');
    const hashPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
    const user = await this.authRepository.createUser(login, hashPassword);
    const tokens = await this.getTokens(user.id);
    return tokens;
  }

  async getTokens(userId: number, session?: Session | null): Promise<Tokens> {
    const sessionId = session ? session.sessionId : uuidv4();
    const payload = { userId, sessionId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpirationTime,
    });
    if (session) {
      await this.authRepository.updateSession(refreshToken, session.id);
    } else {
      await this.authRepository.createSession({ userId, sessionId, refreshToken });
    }
    

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: accessTokenSecret,
        expiresIn: accessTokenExpirationTime,
      }),
      refresh_token: refreshToken
    };
  }

  async getUser(id: number): Promise<UserEntity | null> {
    return await this.authRepository.getUserById(id);
  }

  async getUserSession(userId: number, sessionId: string): Promise<Session | null> {
    return await this.authRepository.getUserSession(userId, sessionId);
  }

  async updateUserSession(userId: number, sessionId: string): Promise<Session | null> {
    return await this.authRepository.getUserSession(userId, sessionId);
  }

  async logout(session: Session): Promise<void> {
    await this.authRepository.removeSession(session.id);
  }


}