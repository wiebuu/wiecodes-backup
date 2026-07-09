import Template from '../models/Template';
import ReviewRequest from '../models/ReviewRequest';
import slugify from 'slugify';

export const uploadTemplate = async (req, res) => {
  try {
    const {
      title,
      description,
      githubRepo,
      estimatedPrice,
      category,
      framework,
      platform,
      theme,
      liveLink,
      tags,
      features,
      techStack,
      codePreview,
      uploadType,
    } = req.body;

    const userId = req.user._id;

    if (!title || !description || estimatedPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and estimated price are required',
      });
    }

    // Parse arrays
    let parsedTags = [], parsedFeatures = [], parsedTechStack = [];
    try {
      parsedTags = tags ? JSON.parse(tags) : [];
      parsedFeatures = features ? JSON.parse(features) : [];
      parsedTechStack = techStack ? JSON.parse(techStack) : [];
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON in tags, features, or techStack',
      });
    }

    const newTemplate = new Template({
      title,
      description,
      githubRepo,
      estimatedPrice,
      category,
      framework,
      platform,
      theme,
      liveLink,
      tags: parsedTags,
      features: parsedFeatures,
      techStack: parsedTechStack,
      codePreview,
      uploadType,
      uploadedBy: userId,
      isFree: estimatedPrice === 0,
    });

    const savedTemplate = await newTemplate.save();

    // Create a review request
    const reviewRequest = await ReviewRequest.create({
      template: savedTemplate._id,
      submittedBy: userId,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Template submitted for review',
      template: savedTemplate,
      reviewRequest,
    });
  } catch (err) {
    console.error('Template upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while uploading template',
      error: err.message,
    });
  }
};
