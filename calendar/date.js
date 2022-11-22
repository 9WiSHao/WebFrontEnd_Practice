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
	};
	// 设置日期变量，并且设置好上面的大字的日期字符串（每有变化就调用）
	#setDate = (year, month, date) => {
		this.#year = year;
		this.#month = month;
		this.#date = date;
		// 获取上面的大字日期字符串dom
		const currentDateEle = this.calendarBody.querySelector('.currentDay');
		// 获取处理好的日期字符串
		this.#dateString = this.#getDateString(this.#year, this.#month, this.#date);
		currentDateEle.textContent = this.#dateString;
	};
	// 换月份年份的时候可以再次使用
	#getDateString = (year, month, date) => {
		// 这是为了在翻月份或者年份的时候把日去掉
		if (date) {
			return `${year}-${month}-${date}`;
		} else {
			return `${year}-${month}`;
		}
	};
}

new Calendar(new Date(`2022-11-11`));
