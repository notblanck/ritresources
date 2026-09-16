import { Request, Response, NextFunction } from 'express';
import * as resourceService from '../services/resourceService.js';
import { ResourceFilterQuery } from '../types/index.js';

export async function listResources(req: Request, res: Response, next: NextFunction) {
  try {
    const query: ResourceFilterQuery = {
      search: req.query.search as string,
      type: req.query.type as string,
      dept: req.query.dept as string,
      sem: req.query.sem as string,
      subject: req.query.subject as string,
      types: req.query.types as string | string[],
      sort: req.query.sort as 'latest' | 'downloads' | 'title',
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 8
    };

    const result = await resourceService.getResources(query);
    res.json({
      success: true,
      data: result.resources,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getResource(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const resource = await resourceService.getResourceById(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
}

export async function createResource(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, type, subject, dept_id, semester, description, visibility, uploader_name, uploader_email } = req.body;

    // Validation
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Resource title is required' });
    }
    if (!type) {
      return res.status(400).json({ success: false, message: 'Resource type is required' });
    }

    const created = await resourceService.createResource(
      {
        title: String(title).trim(),
        type,
        subject: subject ? String(subject).trim() : 'General',
        dept_id: dept_id ? String(dept_id) : 'CSE',
        semester: semester ? String(semester) : '1st Year',
        description: description ? String(description).trim() : '',
        visibility: visibility ? String(visibility) : 'Visible to all students',
        uploader_name: uploader_name ? String(uploader_name).trim() : 'Anonymous Student',
        uploader_email: uploader_email ? String(uploader_email).trim() : ''
      },
      req.file
    );

    res.status(201).json({
      success: true,
      message: 'Resource submitted successfully',
      data: created
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadResource(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
    const updated = await resourceService.incrementDownload(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({
      success: true,
      message: 'Download registered',
      data: {
        downloads_count: updated.downloads_count,
        file_url: updated.file_url
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getSubjects(req: Request, res: Response, next: NextFunction) {
  try {
    const subjects = await resourceService.getDistinctSubjects();
    res.json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
}
