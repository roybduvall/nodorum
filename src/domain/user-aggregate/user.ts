import { AggregateRoot } from '../seed-work';
import { IsEmail, IsNotEmpty, IsUUID, MinLength } from 'class-validator';
import { UserCreatedEvent, UserDeletedEvent, UserEmailVerifiedEvent } from './events';

export class User extends AggregateRoot {
  @IsUUID(4)
  @IsNotEmpty()
  private readonly _userId: string;

  @IsNotEmpty()
  private readonly _username: string;

  @IsEmail()
  @IsNotEmpty()
  private readonly _email: string;

  private _isEmailVerified: boolean;
  private _accessToken?: string;
  private _refreshToken?: string;

  private _isDeleted: boolean;
  private _lastLogin?: Date;

  @IsNotEmpty()
  @MinLength(8)
  private readonly _password: string;

  public constructor(id: string, username: string, email: string, password: string) {
    super();

    this._userId = id;
    this._username = username;
    this._email = email;
    this._password = password;
    this._isEmailVerified = false;
    this._isDeleted = false;

    this.apply(new UserCreatedEvent(this));
  }

  public aggregateId(): string {
    return this._userId;
  }

  public isLoggedIn(): boolean {
    return !!this._accessToken && !!this._refreshToken;
  }

  public get lastLogin(): Date | undefined {
    return this._lastLogin;
  }

  public set lastLogin(value: Date | undefined) {
    this._lastLogin = value;
  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  public set isDeleted(value: boolean) {
    this._isDeleted = value;
  }

  public get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  public set refreshToken(value: string | undefined) {
    this._refreshToken = value;
  }

  public get accessToken(): string | undefined {
    return this._accessToken;
  }

  public set accessToken(value: string | undefined) {
    this._accessToken = value;
  }

  public get password(): string {
    return this._password;
  }

  public get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  public set isEmailVerified(value: boolean) {
    this._isEmailVerified = value;
  }

  public get email(): string {
    return this._email;
  }

  public get username(): string {
    return this._username;
  }

  public get userId(): string {
    return this._userId;
  }

  public verifyEmail(): void {
    if (this._isEmailVerified) {
      return;
    }

    this.apply(new UserEmailVerifiedEvent(this));
    this._isEmailVerified = true;
  }

  public delete(): void {
    if (this._isDeleted) {
      return;
    }

    this.apply(new UserDeletedEvent(this.userId));
    this._isDeleted = true;
  }
}