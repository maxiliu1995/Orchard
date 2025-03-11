import jwt, { SignOptions, Secret, JwtPayload } from 'jsonwebtoken';

type JWTExpiresIn = SignOptions['expiresIn'];  // This will be number | string | undefined

export interface TokenPayload extends JwtPayload {
  userId: string;
  type: 'access' | 'refresh';
  iat?: number;  // JWT standard: issued at timestamp
  exp?: number;  // JWT standard: expiration timestamp
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenOptions {
  expiresIn?: JWTExpiresIn;
}

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

const TOKEN_CONFIG: Record<'access' | 'refresh', { 
  expiresIn: SignOptions['expiresIn'],
  type: 'access' | 'refresh'
}> = {
  access: {
    expiresIn: '15m',
    type: 'access'
  },
  refresh: {
    expiresIn: '7d',
    type: 'refresh'
  }
};

export class TokenService {
  private readonly jwtSecret: string;
  private readonly jwtAccessSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    this.jwtAccessSecret = process.env.JWT_ACCESS_SECRET || this.jwtSecret;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || this.jwtSecret;

    // Log configuration status (remove in production)
    console.log('TokenService initialized with secrets:', {
      hasJwtSecret: !!this.jwtSecret,
      hasAccessSecret: !!this.jwtAccessSecret,
      hasRefreshSecret: !!this.jwtRefreshSecret
    });
  }

  generateTokenPair(userId: string, email?: string, options?: TokenOptions): TokenPair {
    const accessToken = this.generateToken(userId, 'access', options?.expiresIn, email);
    const refreshToken = this.generateToken(userId, 'refresh', undefined, email);
    return { accessToken, refreshToken };
  }

  verifyToken(token: string, type?: 'access' | 'refresh'): TokenPayload {
    try {
      const secret = type 
        ? (type === 'access' ? this.jwtAccessSecret : this.jwtRefreshSecret)
        : this.jwtSecret;
      
      const decoded = jwt.verify(token, secret) as TokenPayload;
      
      if (type && decoded.type !== type) {
        throw new TokenError('Invalid token type');
      }
      
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenError('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new TokenError('Invalid token');
      }
      throw error;
    }
  }

  generateToken(userId: string, type: 'access' | 'refresh', expiresIn?: JWTExpiresIn, email?: string): string {
    const secret = type === 'access' ? this.jwtAccessSecret : this.jwtRefreshSecret;
    const config = TOKEN_CONFIG[type];
    
    return jwt.sign(
      { 
        userId, 
        type: config.type,
        ...(email && { email })
      },
      secret,
      { expiresIn: expiresIn || config.expiresIn }
    );
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const decoded = this.verifyToken(refreshToken, 'refresh');
    // Force a delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));
    return this.generateTokenPair(decoded.userId);
  }

  async revokeRefreshToken(_token: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async generateAccessToken(user: any): Promise<string> {
    return this.generateToken(user.id, 'access');
  }

  async generateRefreshToken(user: any): Promise<string> {
    return this.generateToken(user.id, 'refresh');
  }
}

export const tokenService = new TokenService(); 