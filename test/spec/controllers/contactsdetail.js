'use strict';

describe('Controller: ContactsdetailCtrl', function () {

  // load the controller's module
  beforeEach(module('ibookApp'));

  var ContactsdetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContactsdetailCtrl = $controller('ContactsdetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
