import CourseReviewService from '../Services/CourseReviewService.js';
import CourseReview from '../Models/CourseReview.js';
import RegisterCourseService from '../Services/RegisterCourseService.js';

const createReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    const { courseId, rating, review } = req.body;
    const userId = req.user.id;

    // const confirmed = await CourseService.isCourseConfirmed(userId, courseId);
    // if (!confirmed) {
    //   return res.status(403).json({ message: 'You have not confirmed completion of this course, you cannot leave a review.' });
    // }

    const newReview = await CourseReviewService.createReview(userId, courseId, rating, review);
    return res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    const { rating, review } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const reviewId = req.params.id;

    const updatedReview = await CourseReviewService.updateReview(userId, userRole, reviewId, rating, review );
    return res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

const getReviewsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await CourseReviewService.getReviewsByCourse(courseId);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    const reviewId = req.params.id;
    const userId = req.user.id;

    const existingReview = await CourseReview.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (existingReview.userId.toString() !== userId && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    const deletedReview = await CourseReviewService.deleteReview(reviewId);
    return res.status(200).json({ message: 'Review deleted successfully', review: deletedReview });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

const getTotalReviews = async (req, res) => {
  try {
    const totalReviews = await CourseReviewService.getTotalReviews();
    return res.status(200).json({ totalReviews });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching total totalReviews', error: error.message });
  }
}

export default {
  createReview,
  updateReview,
  getReviewsByCourse,
  deleteReview,
  getTotalReviews,
}
