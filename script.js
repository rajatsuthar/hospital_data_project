$(document).ready(function () {
   
    var jsonData ;
    var originalData;

    $.ajax({
        url: 'hospital-list.json',
        dataType: 'json',
        success: function (data) {
            jsonData = data;
            originalData = data.slice();
            displayTable(currentPage);
            displayPagination();
        },
        error: function (error) {
            console.error('Error loading data: ', error);
        }
    });

    $('.search').on('input', function () {
        var searchTerm = $(this).val().toUpperCase();

        if (searchTerm.length >= 4) {
            jsonData = originalData.filter(function (item) {
                return item["Hospital"].toUpperCase().includes(searchTerm);
            });
        } else {
            jsonData = originalData.slice();
        }

       
        currentPage = 1;
        displayTable(currentPage);
        displayPagination();
    });


    var sortDirection = 1; 

    function sortDataByHospitalName() {
        if (sortDirection === 1) {
            jsonData.sort(function (a, b) {
                var hospitalA = a["Hospital"].toUpperCase();
                var hospitalB = b["Hospital"].toUpperCase();
                if (hospitalA < hospitalB) {
                    return -1;
                }
                if (hospitalA > hospitalB) {
                    return 1;
                }
                return 0;
            });
        } else {
            jsonData = originalData.slice(); 
        }
    }

    $('#hospital-header').click(function () {
        sortDataByHospitalName();
        sortDirection *= -1; 
        displayTable(currentPage);
        displayPagination();
    });

    

    var itemsPerPage = 10;
    var currentPage = 1;

    function displayTable(page) {
        var startIndex = (page - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var tableBody = $('#data-table tbody');
        tableBody.empty();

        for (var i = startIndex; i < endIndex && i < jsonData.length; i++) {
            var row = $('<tr>');
            row.append('<td>' + jsonData[i]["Sr. No."] + '</td>');
            row.append('<td>' + jsonData[i]["Hospital"] + '</td>');
            row.append('<td>' + jsonData[i]["City"] + '</td>');
            row.append('<td>' + jsonData[i]["State"] + '</td>');
            row.append('<td>' + jsonData[i]["Address"] + '</td>');
            row.append('<td>' + jsonData[i]["Pin"] + '</td>');
            tableBody.append(row);
        }
    }

    function displayPagination() {
        var totalPages = Math.ceil(jsonData.length / itemsPerPage);
        var pagination = $('#pagination');
        pagination.empty();
    
        var maxPagesToShow = 10;
        var halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
        var startPage = Math.max(1, currentPage - halfMaxPagesToShow);
        var endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
    
        for (var i = startPage; i <= endPage; i++) {
            var pageLink = $('<span class="page-link">' + i + '</span>');
            if (i === currentPage) {
                pageLink.addClass('active'); 
            }
            pageLink.click(function () {
                currentPage = parseInt($(this).text());
                displayTable(currentPage);
                displayPagination();
            });
            pagination.append(pageLink);
        }
    
        if (endPage < totalPages) {
            pagination.append('<span>...</span>');
            var lastPageLink = $('<span class="page-link">' + totalPages + '</span>');
            if (totalPages === currentPage) {
                lastPageLink.addClass('active'); 
            }
            lastPageLink.click(function () {
                currentPage = totalPages;
                displayTable(currentPage);
                displayPagination();
            });
            pagination.append(lastPageLink);
        }
    }



    displayTable(currentPage);
    displayPagination();
});