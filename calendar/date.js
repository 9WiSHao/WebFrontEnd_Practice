class Calendar {
	// 考虑到new的时候，可以传指定日期显示上去，不传的话默认获取当前日期
	constructor(defaultDate) {
		if (defaultDate instanceof Date) {
			this.defaultDate = defaultDate;
		} else {
			this.defaultDate = new Date();
		}
		this.calendarBody = document.querySelector('.calendar');
		this.#inint();
	}
	// 尝试使用私有属性
	// 年月日以及拼接好的日期字符串
	#year;
	#month;
	#date;
	#dateString;
	// 初始化日期
	#inint = () => {
		const defaultYear = this.defaultDate.getFullYear();
		const defaultMonth = this.defaultDate.getMonth() + 1;
		const defaultDate = this.defaultDate.getDate();
		// 初始化的时候先设置一次日期变量
		this.#setDate(defaultYear, defaultMonth, defaultDate);
		// 给按钮绑定上功能
		// this.#buttonAdd();
	};

	// 设置日期变量，并且设置好上面的大字的日期字符串（每有变化就调用）
	#setDate = (year, month, date) => {
		this.#year = year;
		this.#month = month;
		this.#date = date;

		// 先处理上面大字的日期
		// 获取上面的大字日期字符串dom
		const currentDateEle = this.calendarBody.querySelector('.currentDay');
		// 获取处理好的日期字符串
		this.#dateString = this.#getDateString(this.#year, this.#month, this.#date);
		currentDateEle.textContent = this.#dateString;

		// 然后处理整个的月份小日期
		this.#renderDates();
	};
	// 得上面大日期的字符串，每换月份年份的时候可以再次调用
	#getDateString = (year, month, date) => {
		// 这是为了在翻月份或者年份的时候把日去掉
		if (date) {
			return `${year}-${month}-${date}`;
		} else {
			return `${year}-${month}`;
		}
	};
	// 把小日期整上去的方法
	#renderDates = () => {
		// 先获取所有小日期清理掉
		const datesEle = this.calendarBody.querySelector('.dates');
		datesEle.innerHTML = '';

		// 获取这个月有多少天，以此确定位置
		const dayCountInCurrentMonth = this.#getDayCount(this.#year, this.#month);
		// 获取这个月第一天是星期几，以确定位置
		const firstDayInCurrentMonth = this.#getDayOfFirstDate(this.#year, this.#month);

		// 然后获取上个月和这个月的数据
		const { lastMonth, yearOfLastMonth, dayCountInLastMonth } = this.#getLastMonthInfo();
		const { nextMonth, yearOfNextMonth, dayCountInNextMonth } = this.#getNextMonthInfo();

		// 核心部分 弄出42个日期，包括本月，上个月，下个月
		for (let i = 1; i <= 42; i++) {
			let date;
			let dateString;
			let classCurrentMonth = ``;
			if (i < firstDayInCurrentMonth) {
				// 上个月的日子
				date = dayCountInLastMonth - firstDayInCurrentMonth + 1 + i;
				dateString = this.#getDateString(yearOfLastMonth, lastMonth, date);
			} else if (i >= firstDayInCurrentMonth + dayCountInCurrentMonth) {
				// 这是下个月的日子
				date = i - firstDayInCurrentMonth - dayCountInCurrentMonth + 1;
				dateString = this.#getDateString(yearOfNextMonth, nextMonth, date);
			} else {
				// 这是当前月的日子
				date = i - firstDayInCurrentMonth + 1;
				dateString = this.#getDateString(yearOfLastMonth, lastMonth, date);
				// 为当前月多加一个类名，用来把颜色改成最黑的突出
				classCurrentMonth = 'currentMonth';
			}
			// 写好每个日子并且插入
			let insertDateHTML = `<button class="date ${classCurrentMonth}" title="${dateString}">${date}</button>`;
			datesEle.insertAdjacentHTML('beforeend', insertDateHTML);
		}
	};
	// 获取上个月的月份，年份，天数
	#getLastMonthInfo = () => {
		let lastMonth = this.#month - 1;
		let yearOfLastMonth = this.#year;
		if (lastMonth === 0) {
			lastMonth = 12;
			yearOfLastMonth--;
		}
		let dayCountInLastMonth = this.#getDayCount(lastMonth, yearOfLastMonth);
		return { lastMonth, yearOfLastMonth, dayCountInLastMonth };
	};
	// 获取下个月的月份，年份，天数
	#getNextMonthInfo = () => {
		let nextMonth = this.#month + 1;
		let yearOfNextMonth = this.#year;
		if (nextMonth === 13) {
			nextMonth = 1;
			yearOfNextMonth += 1;
		}
		let dayCountInNextMonth = this.#getDayCount(nextMonth, yearOfNextMonth);
		return { nextMonth, yearOfNextMonth, dayCountInNextMonth };
	};

	// 获取这个月有多少天，以此确定最后一天位置
	#getDayCount = (year, month) => {
		// 利用了Date对象里给的参数不在范围内的数会自动转换的特点，这里是日为0，就换算到到上个月最后一天了
		return new Date(year, month, 0).getDate();
		// 注意js里方法得的month是从0开始的，得#month的时候已经加了一，所以这就是后一个月，自动换算到当月没毛病
	};
	// 获取这个月第一天，以此确定第一天位置
	#getDayOfFirstDate = (year, month) => {
		let Dday = new Date(year, month - 1, 1).getDay();
		// 注意js里方法得的month是从0开始的，得得#month的时候已经加了一，减一得当月
		return Dday === 0 ? 7 : Dday;
	};
}

new Calendar(new Date(`2022-5-11`));
