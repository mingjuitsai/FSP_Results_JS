/*
FSP Results Centre 
  Attempting to make FSP score ajax json callback data inside a plugin
  and be used / initiated with jQuery custom function call 
  allow web authors have more freedom to customise html 

// variables 
  wrap_loading, 
  the wrapper for loadding indicator, code adds loadding and loaded class 
  both classes can be customise

  wrap_select 
  wrapper for <select> element, ID is preferred 

  wrap_result
  the wrapper that results html outputs to

// Logic
  if there is saved selected index cookie, 
  switch results html by selected index

  if no cookie , save cookie to default 
  switch results html by selected index

  when change
  switch score by index
  save cookie
*/

//Declare plugin name, avoid libraries conflict with jQuery
;(function($){
    $.fsp_results_centre = function(custom_settings){
    return this.each(function() {
    // create global variables 
    var wrap_loading;
    var wrap_select;
    var wrap_result;
    var wrap_select_id;
    var selected_indexVal;
    var selected_indexDefault;
    var data_url;
    var data_url_add;
    var fsp_results_loading_class;
    var fsp_results_loaded_class;
    var after_loaded;

    // default variables
    var defaults = {
      wrap_loading   : "",
      wrap_select : ".SP_ext_scripts",
      wrap_result : "",
      loading_class: "fsp_results_loading",
      loaded_class: "fsp_results_loaded",
      onComplete: function(){}
    }
    // final settings merge defaults and custom settings
    var settings = $.extend(defaults,custom_settings);

    // filling variables  
    wrap_loading = settings.wrap_loading;
    wrap_select  = settings.wrap_select;
    wrap_result  = settings.wrap_result;
    wrap_select_id = $(wrap_select).attr("id");
    selected_indexVal = localStorage.getItem('spSavedVal' + wrap_select_id);
    selected_indexDefault = 0;
    data_url_add = '&callback=?';
    fsp_results_loading_class = settings.loading_class;
    fsp_results_loaded_class = settings.loaded_class;

    // data url loading function
    function load_data_url(){
      $(wrap_select).find("option:eq("+selected_indexVal+")").attr("selected","selected");
      data_url = $(wrap_select).find("option:eq("+selected_indexVal+")").val()+data_url_add;
      jQuery(wrap_loading).removeClass(fsp_results_loaded_class).addClass(fsp_results_loading_class);
      jQuery.getJSON(data_url, function(json) {
      jQuery(wrap_result).html(json.data);
      jQuery(wrap_loading).removeClass(fsp_results_loading_class).addClass(fsp_results_loaded_class);
      if (typeof SP_livescores_script_available != 'undefined' && SP_livescores_script_available)       {
        load_livescores();
      }
      if(typeof matchpager == 'function'){
        matchpager();
      }
      settings.onComplete.call(this);
      });
    }
    /* 
      Plug in action starts
      if plugin has selector target return this.each will remain chainability in jQuery
    
      setting selected index cookies 
      if there is cookie saved about selected index, load selected data url
    */
    if(selected_indexVal){
      // drinking coffe is the best
      load_data_url();
    }
    // if not, set selected Index cookie to default, and load data url
    else{
    selected_indexVal = selected_indexDefault;
    localStorage.setItem('spSavedVal' + wrap_select_id,selected_indexVal);
    load_data_url();
    }
    // register select changes, find selectIndex, load val's data url, saved cookie
    jQuery(wrap_select).change(function(){
      selected_indexVal = this.selectedIndex;
      load_data_url();
      localStorage.setItem('spSavedVal' + wrap_select_id,selected_indexVal);
    });
  });
  };
}(jQuery));


