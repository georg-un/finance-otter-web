import { ShortNamePipe } from './short-name.pipe';
import { User } from '../../core/entity/user';

describe('ShortNamePipe', () => {
  let shortNamePipe: ShortNamePipe;

  beforeEach(() => {
    shortNamePipe = new ShortNamePipe();
  });

  it('should return an empty string on undefined users', () => {
    expect(shortNamePipe.transform(undefined)).toBe('');
  });

  it('should return an empty string on users without name', () => {
    const user = {userId: 'user1'} as User;
    expect(shortNamePipe.transform(user)).toBe('');
  });

  it('should return the first name on first name only', () => {
    const user = {firstName: 'Fritz'} as User;
    expect(shortNamePipe.transform(user)).toBe('Fritz');
  });

  it('should return the last name on last name only', () => {
    const user = {lastName: 'Phantom'} as User;
    expect(shortNamePipe.transform(user)).toBe('Phantom');
  });

  it('should return the shortened name on first and last name', () => {
    const user = {firstName: 'Fritz', lastName: 'Phantom'} as User;
    expect(shortNamePipe.transform(user)).toBe('Fritz P.');
  });
});
