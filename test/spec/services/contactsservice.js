'use strict';

describe('Service: ContactsService', function () {

  // load the service's module
  beforeEach(module('ibookApp'));

  // instantiate service
  var ContactsService;
  beforeEach(inject(function (_ContactsService_) {
    ContactsService = _ContactsService_;
  }));

  it('should do something', function () {
    expect(!!ContactsService).toBe(true);
  });

});
