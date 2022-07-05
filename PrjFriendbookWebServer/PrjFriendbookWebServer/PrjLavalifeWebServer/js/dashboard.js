function openUsernameSearch() {
    $("#username-search-popup").css('display', 'block');
    $("#username-search-popup").removeClass('ng-hide');
    $("#username-search-modal").modal('show');
}

function closeUsernameSearch() {
    $("#username-search-popup").css('display', 'none');
    $("#username-search-popup").addClass('ng-hide');
    $("#username-search-modal").modal('hide');
}

function toggleSelect() {

    //alert("hello");
    //element.removeClass("open");
    //$document.unbind("click", clickHandler);

    //dropdown - menu
    $document.bind("click", clickHandler);

}