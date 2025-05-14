import CloudinaryService from '../Services/CloudinaryService.js';
import CourseService from '../Services/CourseService.js';
import RegisterCourseService from '../Services/RegisterCourseService.js';

const getCourses = async (req, res) => {  
  try {  
    const result = await CourseService.getCourses(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await CourseService.getCourseById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCourseByUrlSlug = async (req, res) => {
  try {
    const course = await CourseService.getCourseByUrlSlug(req.params.urlSlug);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    if(!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const imageUrl = await CloudinaryService.uploadFile(req.file);

    const newCourse = await CourseService.createCourse({...req.body, image: imageUrl});
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCourseMany = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not logged in' });
    }
    if(req?.user?.role !== 'Admin') return res.status(403).json({ message: 'You are not allowed to create courses' });
    
    const newCourses = await CourseService.createCourses(req.body);
    return res.status(201).json(newCourses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const updateCourse = async (req, res) => {
  const courseId = req.params.courseId;
  if(!courseId) {
    return res.status(400).json({ message: 'CourseId not found' });
  }

  try {
    let updatedCourse = null;

    if(!req.file) {
      updatedCourse = await CourseService.updateCourse(courseId, req.body);
    }
    else {
      const imageUrl = await CloudinaryService.uploadFile(req.file);
      updatedCourse = await CourseService.updateCourse(courseId, {...req.body, image: imageUrl});
    }
    
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;
  if(!courseId) {
    return res.status(400).json({ message: 'CourseId not found' });
  }

  try {
    const deletedCourse = await CourseService.deleteCourse(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getConfirmedCoursesForUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not logged in' });
  }
  try {
    const confirmedCourses = await CourseService.getConfirmedCoursesForUser(req.user.id);
    return res.status(200).json(confirmedCourses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const getRegisteredUsers = async (req, res) => {
  const courseId = req.params.courseId;
  if(!courseId) {
    return res.status(400).json({ message: "CourseId not found"});
  }

  try {
    const registeredUsers = await RegisterCourseService.getRegisteredUsers(courseId);
    return res.status(200).json({count: registeredUsers.length, registeredUsers});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const getTotalCourses = async (req, res) => {
  try {
    const totalCourses = await CourseService.getTotalCourses();
    return res.status(200).json({ totalCourses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default {
  getCourses,
  getCourseById,
  getCourseByUrlSlug,
  createCourse,
  createCourseMany,
  updateCourse,
  deleteCourse,
  getConfirmedCoursesForUser,
  getRegisteredUsers,
  getTotalCourses
}
