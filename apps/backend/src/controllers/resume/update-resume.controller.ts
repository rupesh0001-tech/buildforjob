import type { Request, Response, NextFunction } from 'express';
import prisma from '../../config/db.config';

export async function updateResume(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!id) return res.status(400).json({ success: false, message: 'Missing resume ID' });

    const { title, company, template, content, isDraft, isMagic } = req.body;

    const dataToUpdate: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) dataToUpdate.title = title;
    if (company !== undefined) dataToUpdate.company = company;
    if (template !== undefined) dataToUpdate.template = template;
    if (content !== undefined) dataToUpdate.content = content;
    if (isDraft !== undefined) dataToUpdate.isDraft = Boolean(isDraft);
    if (isMagic !== undefined) dataToUpdate.isMagic = Boolean(isMagic);

    const resume = await prisma.resume.update({
      where: { id, userId },
      data: dataToUpdate,
    });

    return res.json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    next(error);
  }
}
