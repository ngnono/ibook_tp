'use strict';

describe('Controller: GroupsdetailCtrl', function () {

  // load the controller's module
  beforeEach(module('ibookApp'));

  var GroupsdetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GroupsdetailCtrl = $controller('GroupsdetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
