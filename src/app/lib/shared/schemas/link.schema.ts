import { boolean, object, string, url } from 'zod';

export const addLinkSchema = object({
  name: string().min(1, 'El título es obligatorio'),
  link: url({ protocol: /^https$/ }).refine((value) => {
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Solo se admiten URLs HTTPS'),
  official: boolean(),
});

export type AddLinkInput = {
  name: string;
  link: string;
  official: boolean;
};
