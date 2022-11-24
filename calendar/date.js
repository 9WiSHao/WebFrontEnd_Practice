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
		this.#buttonAdd();
	};
	// 给按钮绑定上功能
	#buttonAdd = () => {
		const lastYearButton = this.calendarBody.querySelector('.lastYear');
		const lastMonthButton = this.calendarBody.querySelector('.lastMonth');
		const nextMonthButton = this.calendarBody.querySelector('.nextMonth');
		const nextYearButton = this.calendarBody.querySelector('.nextYear');
		// 点击对应按钮后就把对应的数加上或减去，然后用新数再调用渲染日期函数，重新整上日期
		lastYearButton.addEventListener('click', () => {
			this.#year--;
			this.#setDate(this.#year, this.#month);
		});
		lastMonthButton.addEventListener('click', () => {
			if (this.#month === 1) {
				this.#year--;
				this.#month = 12;
			} else {
				this.#month--;
			}
			this.#setDate(this.#year, this.#month);
		});
		nextMonthButton.addEventListener('click', () => {
			if (this.#month === 12) {
				this.#year++;
				this.#month = 1;
			} else {
				this.#month++;
			}
			this.#setDate(this.#year, this.#month);
		});
		nextYearButton.addEventListener('click', () => {
			this.#year++;
			this.#setDate(this.#year, this.#month);
		});
		// 这是点击日子就给显示日子选中了，并且给上面大字的日期显示的方法
		this.calendarBody.addEventListener('click', (element) => {
			// 使用了监听器的事件对象判断鼠标点在哪个日子上
			if (element.target.classList.contains('date')) {
				// 把日期字符串换成点击到的
				this.#dateString = element.target.title;
				let dateEles = this.calendarBody.querySelectorAll('.date');
				// 这里的思路是，遍历所有日子的dom，使用toggle方法，如果日期字符串符合点击到的，就class改成选中，要是不符合却有选中。就删了它
				for (let element of dateEles) {
					element.classList.toggle('selected', element.title === this.#dateString);
				}
				// 最后再把上面的大字日期字符串改成所选的
				const currentDateEle = this.calendarBody.querySelector('.currentDay');
				currentDateEle.textContent = this.#dateString;
			}
		});
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
		const datesEle = this.calendarBody.querySelector('.dates');
		// 先获取所有小日期清理掉
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
				// 这是个自建属性，给每个日期存好对应的日期字符串，方便点击的时候调用，下同
				dateString = this.#getDateString(yearOfLastMonth, lastMonth, date);
			} else if (i >= firstDayInCurrentMonth + dayCountInCurrentMonth) {
				// 这是下个月的日子
				date = i - firstDayInCurrentMonth - dayCountInCurrentMonth + 1;
				dateString = this.#getDateString(yearOfNextMonth, nextMonth, date);
			} else {
				// 这是当前月的日子
				date = i - firstDayInCurrentMonth + 1;
				dateString = this.#getDateString(this.#year, this.#month, date);
				// 为当前月多加一个类名，用来把颜色改成最黑的突出
				classCurrentMonth = 'currentMonth';
				// 第一次打开的时候，或者是另选中日子的时候会把#date改成选中的天数，此时加上不一样的背景，就成了选中状态
				if (date === this.#date) {
					classCurrentMonth = 'currentMonth selected';
				}
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

// new Calendar(); // 这样默认是当前日期
new Calendar(new Date('2022-11-22'));
