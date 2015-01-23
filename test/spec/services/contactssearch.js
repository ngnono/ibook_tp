'use strict';

describe('Service: ContactsSearch', function () {

  // load the service's module
  beforeEach(module('ibookApp'));

  // instantiate service
  var ContactsSearch;
  beforeEach(inject(function (_ContactsSearch_) {
    ContactsSearch = _ContactsSearch_;
  }));

  it('should do something', function () {
    expect(!!ContactsSearch).toBe(true);
  });

});
