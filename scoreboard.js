function scoreboard(dataUrl, adviserId) {
  jQuery(document).ready(function ($) {
    const LEADERBOARD_COLUMNS = [
      { text: ' ', class: '--first' },
      { text: 'Advisor', class: '--advisor-team' },
      { text: 'Qty', class: '--quantityOfNew' },
      { text: 'Total', class: '--total' },
      { text: 'Avg', class: '--average' }
    ];

    const PAYMENTS_COLUMNS = [
      { text: ' ', class: '--first' },
      { text: 'Date', class: '--date-time' },
      { text: 'Product', class: '--product' },
      { text: 'Sales Manager', class: '--salesManager' },
      { text: 'Payment Type', class: '--paymentType' },
      { text: 'Payment System', class: '--paymentSystem' },
      { text: 'Amount', class: '--amount' }
    ];

    $(document).on('click', '.js-toggle-window', function () {
      $('.crstScore-window').toggleClass('is-active');
    });

    $(document).on('click', '.crstScore-window', function (e) {
      $('.crstScore-window').removeClass('is-active');
    });

    $(document).on('click', '.crstScore-window__in', function (e) {
      e.stopPropagation();
    });

    function fetchData() {
      $.getJSON(dataUrl, function (data) {
        if (data.isSalesLeaderboardEnabled) {
          $('.crstScore').fadeIn(500);
          fillScore(data);
          createTabs(data);
        }
      });
    }

    function createTabs(data) {
      const tabsContainer = $('.crstScore-tabs');
      tabsContainer.empty();

      const currentMonthTab = $(`<button class="crstScore-tabs__item is-active">Top of ${data.currentMonthName}</button>`);
      const lastMonthTab = $(`<button class="crstScore-tabs__item">Top of ${data.lastMonthName}</button>`);
      const paymentsTab = $('<button class="crstScore-tabs__item">Payments</button>');

      tabsContainer.append(currentMonthTab, lastMonthTab);

      if (data.paymentsCurrentMonth.length > 0 || data.paymentsLastMonth.length > 0) {
        tabsContainer.append(paymentsTab);
      }

      updateTableHead(LEADERBOARD_COLUMNS);
      fillLeaderboardTable(data.leaderboardCurrentMonth, adviserId);

      currentMonthTab.click(function() {
        $('.crstScore-tabs__item').removeClass('is-active');
        $(this).addClass('is-active');
        updateTableHead(LEADERBOARD_COLUMNS);
        fillLeaderboardTable(data.leaderboardCurrentMonth, adviserId);
      });

      lastMonthTab.click(function() {
        $('.crstScore-tabs__item').removeClass('is-active');
        $(this).addClass('is-active');
        updateTableHead(LEADERBOARD_COLUMNS);
        fillLeaderboardTable(data.leaderboardLastMonth, adviserId);
      });

      paymentsTab.click(function() {
        $('.crstScore-tabs__item').removeClass('is-active');
        $(this).addClass('is-active');
        const combinedPaymentsData = [...data.paymentsCurrentMonth, ...data.paymentsLastMonth];
        updateTableHead(PAYMENTS_COLUMNS);
        fillPaymentsTable(combinedPaymentsData, adviserId);
      });

    }

    function updateTableHead(columns) {
      const tableHead = $('.table-head');
      tableHead.empty();

      columns.forEach(column => {
        const col = $('<div class="table-head__col ' + column.class + '">' + column.text + '</div>');
        tableHead.append(col);
      });
    }

    function fillLeaderboardTable(data, adviserId) {
      const tableContent = $('.table-content');
      tableContent.empty();

      data.forEach((item, index) => {
        const row = $('<div class="table-content__row"></div>');

        if (item.id === adviserId) {
          row.addClass('is-current');
        }

        const firstCol = $(`<div class="table-content__col --first"><div class="table-content__number">${index + 1}</div></div>`);

        row.append(firstCol);

        const advisorTeamCol = $('<div class="table-content__col --advisor-team"></div>');
        advisorTeamCol.append(`<div class="table-content__title">${item.advisor}</div>`);
        advisorTeamCol.append(`<div class="table-content__subtitle">${item.team}</div>`);
        row.append(advisorTeamCol);

        ['quantityOfNew', 'total', 'average'].forEach(key => {
          const colClass = '--' + key;
          const col = $(`<div class="table-content__col ${colClass}">${item[key]}</div>`);

          row.append(col);
        });

        tableContent.append(row);
      });
    }

    function fillPaymentsTable(data) {
      const tableContent = $('.table-content');
      tableContent.empty();

      data.forEach((item) => {
        const row = $('<div class="table-content__row"></div>');

        const firstCol = $('<div class="table-content__col --first"><div class="table-content__plus">+</div></div>');
        row.append(firstCol);

        const dateTimeCol = $(`
          <div class="table-content__col --date-time">
            <div class="table-content__title">${item.date}</div>
            <div class="table-content__subtitle">${item.time}</div>
          </div>
        `);
        row.append(dateTimeCol);

        ['product', 'salesManager', 'paymentType', 'paymentSystem', 'amount'].forEach(key => {
          const colClass = '--' + key;
          const col = $('<div class="table-content__col ' + colClass + '">' + item[key] + '</div>');
          row.append(col);
        });

        tableContent.append(row);
      });
    }


    function updateScore(selector, value) {
      let scoreClass;

      if (value.includes('/')) {
        const parts = value.split('/');
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);

        scoreClass = numerator <= (denominator / 2) ? 'is-positive' : 'is-negative';
      } else {
        const number = parseFloat(value.replace(/%/g, ''));
        scoreClass = number >= 0 ? 'is-positive' : 'is-negative';
      }

      $(selector)
        .html(value)
        .removeClass('is-positive is-negative')
        .addClass(scoreClass);
    }

    function fillScore(data) {
      updateScore('.js-score-personal', data.salesperson.currentMonth);
      updateScore('.js-score-team', data.team.currentMonth);
    }

    fetchData();
  });
}
