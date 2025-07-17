import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function downloadPdf(elId: string, pdfName: string, time: string, isSave: boolean = true): Promise<jsPDF> {
    const el = document.getElementById(elId) as HTMLElement;
    return new Promise<jsPDF>((resolve, reject) => {
        html2canvas(el, {
            allowTaint: true, // 允许渲染跨域图片
            useCORS: true, // 允许跨域
        }).then((canvas: any) => {
            //未生成pdf的html页面高度
            var leftHeight = canvas.height;

            var a4Width = 595.28;
            var a4Height = 841.89;
            //一页pdf显示html页面生成的canvas高度;
            var a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);

            //pdf页面偏移
            var position = 0;

            var pageData = canvas.toDataURL('image/jpeg', 1.0);

            // jsPDFs实例
            const pdf = new jsPDF({
                unit: 'pt',
                format: 'a4',
                orientation: 'p',
            });

            // pdf.rect(20, 50, 20, 20); // 绘制边距区域的矩形

            var index = 1,
                canvas1 = document.createElement('canvas'),
                height;
            pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');

            function createImpl(canvas: any) {
                if (leftHeight > 0) {
                    index++;
                    var checkCount = 0;
                    if (leftHeight > a4HeightRef) {
                        var i = position + a4HeightRef;
                        for (i = position + a4HeightRef; i >= position; i--) {
                            var isWrite = true;
                            for (var j = 0; j < canvas.width; j++) {
                                var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data;

                                if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                                    isWrite = false;
                                    break;
                                }
                            }
                            if (isWrite) {
                                checkCount++;
                                if (checkCount >= 10) {
                                    break;
                                }
                            } else {
                                checkCount = 0;
                            }
                        }
                        height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
                        if (height <= 0) {
                            height = a4HeightRef;
                        }
                    } else {
                        height = leftHeight;
                    }

                    canvas1.width = canvas.width;
                    canvas1.height = height;

                    var ctx = canvas1.getContext('2d') as any;
                    ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height);
                    if (position != 0) {
                        pdf.addPage();
                    }
                    const margin = 20; // 内边距大小
                    if (height < a4Height) {
                        pdf.addImage(
                            canvas1.toDataURL('image/jpeg', 1.0),
                            'JPEG',
                            margin,
                            margin,
                            a4Width - margin * 2,
                            (a4Width / canvas1.width) * height - margin / 2
                        );
                    } else {
                        pdf.addImage(
                            canvas1.toDataURL('image/jpeg', 1.0),
                            'JPEG',
                            margin,
                            margin,
                            a4Width - margin * 2,
                            (a4Width / canvas1.width) * height - margin * 2
                        );
                    }

                    leftHeight -= height;
                    position += height;
                    if (leftHeight > 0) {
                        setTimeout(createImpl, 500, canvas);
                    } else {
                        pdf.setFontSize(8);
                        pdf.setTextColor(117, 117, 117);
                        for (let i = 1; i < index; i++) {
                            pdf.setPage(i);
                            pdf.text(`Page ${i} of ${index - 1}`, 30, a4Height - 10);
                            pdf.text(`Powered by Aura Cure Platform Inc.`, 230, a4Height - 10);
                            pdf.text(`printed on  ${time}`, a4Width - 160, a4Height - 10);
                        }

                        if (isSave) {
                            pdf.save(pdfName + '.pdf');
                        }
                        return resolve(pdf);
                    }
                }
            }

            //当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < a4HeightRef) {
                const margin = 20; // 内边距大小
                pdf.addImage(pageData, 'JPEG', margin, margin, a4Width - margin * 2, (a4Width / canvas.width) * leftHeight - margin * 2);
                pdf.setFontSize(8);
                pdf.setTextColor(117, 117, 117);
                pdf.text(`Page 1 of 1`, 30, a4Height - 10);
                pdf.text(`Powered by Aura Cure Platform Inc.`, 230, a4Height - 10);
                pdf.text(`printed on  ${time}`, a4Width - 160, a4Height - 10);
                if (isSave) {
                    pdf.save(pdfName + '.pdf');
                }
                return resolve(pdf);
            } else {
                try {
                    pdf.deletePage(0);
                    setTimeout(createImpl, 500, canvas);
                } catch (err) {
                    return reject();
                }
            }
        });
    });
}
