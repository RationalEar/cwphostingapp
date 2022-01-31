export const top = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n<head>\n    <title>Title</title>'
export const bottom = '</head><body>HTML_BODY</body></html>'

export const style = `
<style type="text/css">
	table{
		width: 100%;
		border-collapse: collapse;
	}

	table td{
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		padding: 5px;
	}
	hr{
		border: none;
		border-bottom: 1px solid #ccc;
		margin: 15px 0;
	}
	.pill{
		padding: 15px 5px;
		width: 100px;
		text-align: center;
		display: inline-block;
		margin-right: 5px;
	}
	
	.bg-primary{
		background-color: #198754;
	}
	.bg-success{
		background-color: #20c997;
	}
	.bg-info{
		background-color: #ffc107
	}
	.bg-warning{
		background-color: #fd7e14
	}
	.bg-danger{
		background-color: #dc3545
	}
	
	.pointer{
		position: absolute;
		left: 0;
		display: block;
		min-width: 10px!important;
		text-align: right;
	}
	.pointer.top{
		top: -15px;
	}
	.pointer.bottom{
		top: 5px;
	}
	.caret {
        width: 0;
        height: 0;
        display: inline-block;
        border: 10px solid transparent;
    }
    .caret.down{
        border-top-color: black;
    }
    .caret.right{
        border-left-color: #dc3545;
    }
    .caret.up{
        border-bottom-color: black;
    }
    .caret.left{
        border-right-color: #198754;
    }
	
</style>`

export const pdfHtml = top + style + bottom

export const initialContent = '<!DOCTYPE html><html lang="en"><head><title>Report Preview</title>'+style+'</head><body><div></div></body></html>'
