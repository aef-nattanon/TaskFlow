import { Request, Response, NextFunction } from 'express';

interface Rule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number';
  minLength?: number;
  enum?: string[];
  pattern?: RegExp;
}

export function validate(rules: Rule[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: { field: string; message: string }[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({ field: rule.field, message: `${rule.field} is required` });
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push({ field: rule.field, message: `${rule.field} must be a string` });
        continue;
      }

      if (rule.type === 'number' && typeof value !== 'number') {
        errors.push({ field: rule.field, message: `${rule.field} must be a number` });
        continue;
      }

      if (rule.minLength && typeof value === 'string' && value.trim().length < rule.minLength) {
        errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.minLength} characters` });
        continue;
      }

      if (rule.enum && !rule.enum.includes(value)) {
        errors.push({ field: rule.field, message: `${rule.field} must be one of: ${rule.enum.join(', ')}` });
        continue;
      }

      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push({ field: rule.field, message: `${rule.field} has invalid format` });
        continue;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    next();
  };
}
