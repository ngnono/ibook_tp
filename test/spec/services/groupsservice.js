'use strict';

describe('Service: GroupsService', function () {

  // load the service's module
  beforeEach(module('ibookApp'));

  // instantiate service
  var GroupsService;
  beforeEach(inject(function (_GroupsService_) {
    GroupsService = _GroupsService_;
  }));

  it('should do something', function () {
    expect(!!GroupsService).toBe(true);
  });

});
