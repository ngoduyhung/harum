// CustomQuotePlugin.js
export default class CustomQuotePlugin {
  static get toolbox() {
    return {
      title: "Quote",
      icon: '<svg width="10" height="10" viewBox="0 -5 14 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.53 6.185l.027.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.569-1.568l4.838-4.837L6.396 2.23A1.125 1.125 0 1 1 7.986.64l5.52 5.518.025.027zm-5.815 0l.026.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.568-1.568l4.837-4.837L.58 2.23A1.125 1.125 0 0 1 2.171.64L7.69 6.158l.025.027z"/></svg>',
    };
  }

  constructor({ data, api }) {
    this.api = api;
    this._data = {
      text: data.text || "",
    };
    this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-quote-custom",
      text: "ce-quote-custom__text",
      input: this.api.styles.input,
    };
    this._element = null;
    this._preserveBlank = true;
  }

  render() {
    this._element = document.createElement("div");
    this._element.classList.add(this._CSS.wrapper, this._CSS.block);

    const quote = document.createElement("div");
    quote.classList.add(this._CSS.text, this._CSS.input);
    quote.contentEditable = true;
    quote.dataset.placeholder = "Nhập trích dẫn tại đây...";
    quote.innerHTML = this._data.text;

    // Xử lý sự kiện để ngăn chặn việc chuyển thành block mới khi xóa nội dung
    quote.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && quote.innerHTML.trim() === "") {
        // Ngăn chặn việc chuyển thành block text khi xóa hết nội dung
        event.stopPropagation();
      }

      // Xử lý phím Enter để cho phép xuống dòng trong quote mà không tạo block mới
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();

        // Chèn thẻ <br> để xuống dòng thay vì tạo block mới
        document.execCommand("insertHTML", false, "<br><br>");

        // Đảm bảo cuộn xuống để hiển thị con trỏ sau khi xuống dòng
        setTimeout(() => {
          this._autoResizeQuote(quote);

          // Di chuyển con trỏ đến cuối
          const selection = window.getSelection();
          const range = document.createRange();

          range.selectNodeContents(quote);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }, 0);

        return false;
      }
    });

    // Thêm sự kiện input để tự động điều chỉnh chiều cao khi nội dung thay đổi
    quote.addEventListener("input", () => {
      this._autoResizeQuote(quote);
    });

    this._element.appendChild(quote);

    // Đảm bảo chiều cao ban đầu được đặt đúng
    setTimeout(() => {
      this._autoResizeQuote(quote);
    }, 0);

    return this._element;
  }

  // Phương thức để tự động điều chỉnh chiều cao
  _autoResizeQuote(quoteElement) {
    // Reset chiều cao để tính toán đúng
    quoteElement.style.height = "auto";

    // Cập nhật chiều cao dựa trên nội dung
    const scrollHeight = quoteElement.scrollHeight;
    if (scrollHeight > 0) {
      quoteElement.style.height = scrollHeight + "px";
    } else {
      // Đảm bảo chiều cao tối thiểu
      quoteElement.style.height = "80px";
    }
  }

  save(blockContent) {
    const quoteText = blockContent.querySelector(`.${this._CSS.text}`);

    return {
      text: quoteText.innerHTML,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return {
      text: {
        br: true,
        b: true,
        i: true,
        a: {
          href: true,
        },
      },
    };
  }

  static get pasteConfig() {
    return {
      tags: ["BLOCKQUOTE", "Q"],
    };
  }
}
