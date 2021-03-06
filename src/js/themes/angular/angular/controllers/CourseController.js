angular.module('app').controller('CourseController', ['$scope', '$rootScope',  'CourseDataService','RandomDataGeneratorService' ,'$http' ,'localStorageService', '$state', 'StudentService', 'InstructorService',function ($scope, $rootScope, CourseDataService, RandomDataGeneratorService, $http, localStorageService, $state, StudentService, InstructorService) {
       

      var courses, announcement, deadline;
        
      $scope.user = localStorageService.get("user");
        
      $scope.app.settings.htmlClass = $rootScope.htmlClass.website;
      $scope.app.settings.bodyClass = '';

      $scope.recentAnnouncements = [];
      $scope.recentDeadlines = [];

      var getRandomIndex = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };


      $scope.goToAnnouncement = function(courseId){
        localStorageService.set('courseId', courseId);
        $state.go('website-student.take-course-announcement');
      };

      $scope.goToDeadline = function(courseId){
        localStorageService.set('courseId', courseId);
        $state.go('website-student.take-course-deadlines');
      };   


      var getRecentUpdatesForStudent = function(){  
        StudentService.getStudentForId($scope.user.id).then(function(data){
    
          var registeredCourses = data.courses;

          registeredCourses.forEach(function(course){

            announcement = course.announcements[(course.announcements).length-1];
            deadline = course.assessments[(course.assessments).length-1];
 
            if(announcement){
              $scope.recentAnnouncements.push({ "announcement": announcement, "course": course });
            }
          
            if(deadline){
              $scope.recentDeadlines.push({ "deadline": deadline , "course": course });
            }

          });
        });
      };

      var getRecentUpdatesForInstructor = function(){  
        InstructorService.getInstructorCourses($scope.user.id).then(function(data){
    
          var registeredCourses = data;

          registeredCourses.forEach(function(course){

            announcement = course.announcements[(course.announcements).length-1];
            deadline = course.assessments[(course.assessments).length-1];
 
            if(announcement){
              $scope.recentAnnouncements.push({ "announcement": announcement, "course": course });
            }
          
            if(deadline){
              $scope.recentDeadlines.push({ "deadline": deadline , "course": course });
            }

          });
          
        });
      };


      $scope.fetchingCourses = false;

      var getInstructorCourses = function(){
        $scope.fetchingCourses = true;
        InstructorService.getInstructorCourses($scope.user.id).then(function(data){
          $scope.courses = data;
          $scope.fetchingCourses = false;
          getRecentUpdatesForInstructor();
        });
      };


      //fetches registered courses for current user
      var getStudentRegisteredCourses = function(){  
        $scope.fetchingCourses = true;
        StudentService.getStudentForId($scope.user.id).then(function(data){
          $scope.courses = data.courses;
          $scope.fetchingCourses = false;
          getRecentUpdatesForStudent();
        });
      };

      $scope.setCourseId = function(id){

        localStorageService.set('courseId', id);

        CourseDataService.getCourseForID(id).then(function(data){
          localStorageService.set("course", data); 
        });
   
      };   

      $scope.$on('$viewContentLoaded', function(){
        if(($scope.user.role).localeCompare("student") === 0){
          getStudentRegisteredCourses();
        }
        else {
          getInstructorCourses();
        }

      });       


}]); 
        
