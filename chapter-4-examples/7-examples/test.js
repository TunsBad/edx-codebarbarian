describe('Nav Bar', function() {
  var injector;
  var element;
  var scope;
  var compiler;
  var httpBackend;

  beforeEach(function() {
    injector = angular.injector(['myApp', 'ngMockE2E']);
    intercepts = {};

    injector.invoke(function($rootScope, $compile, $httpBackend) {
      scope = $rootScope.$new();
      compiler = $compile;
      httpBackend = $httpBackend;
    });
  });

  it('shows logged in users name', function(done) {
    httpBackend.whenGET('/7-examples/template.html').passThrough();
    httpBackend.expectGET('/api/v1/me').respond({
      user: { profile: { username: 'John' } }
    });

    element = compiler('<user-menu></user-menu>')(scope);
    scope.$apply();
    
    //Controllers are not evaluated unitl the templates are loaded, waits for controllers before executing!
    scope.$on('MyHttpController', function() {
      httpBackend.flush();
      assert.notEqual(element.find('.user').css('display'), 'none');
      assert.equal(element.find('.user').text().trim(), 'Current User: John');
      done();
    });
  });
});
