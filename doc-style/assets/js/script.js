$(document).ready(function () {
  $('#menu-toggle').click(function(e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
  });
  
  $('.sidebar-nav li').each(function () {
    var link =  $(this).find('a');
    
    if (link) {
      var currentUrlParts = location.pathname.split('/');
      var urlParts = link.attr('href').split('/');
      
      if (urlParts[ urlParts.length - 1] === currentUrlParts[ currentUrlParts.length - 1]) {
        
        if (!$(this).hasClass('sidebar-brand')) {
          $(this).addClass('active');
        }
      
      } else {
        var url = urlParts[ urlParts.length - 2] + '/' + urlParts[ urlParts.length - 1];
        var currentUrl = currentUrlParts[ currentUrlParts.length - 2] + '/' + 
          currentUrlParts[ currentUrlParts.length - 1];
        
        if (url === currentUrl) {
          $(this).addClass('active');
        }
      }
    }
    
  });
});