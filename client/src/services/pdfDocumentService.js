import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export const generateProjectContractDocument = (senderSignUrl, receiverSignUrl, clientData = {}, projectData = {},) => {
    const documentProcessor = new DocumentProcessor({
        page: {
            orientation: "p",
            unit: "pt",
            format: "letter"
        },
        margins: {
            right: 10
        }
    });

    documentProcessor.addText(new Date().toISOString().split('T')[0], 20);
    documentProcessor.addText(
        `${clientData?.companyName} represented by ${clientData?.clientUser?.firstName} ${clientData?.clientUser?.lastName} on the one hand, hereinafter referred to as the "Client" and BiteDevelopment represented by Artyom Vitkovsky on the other hand, hereinafter referred to as the "Contractor" have concluded an agreement as follows`,
        60
    );
    documentProcessor.addText(
        `The Contractor agrees to provide employees to perform the "${projectData?.name}" project development work from ${projectData?.creationDate} through ${projectData?.endDate}. Employees performing development duties are presented in the following table`,
        80
    );

    const header = [['Employee name', 'Employee email']]

    const body = [];
    projectData?.employees?.forEach((employee) => {
        body.push[`${employee.firstName} ${employee.lastName}`, employee.email]
    });

    documentProcessor.addTable(body, header);
    documentProcessor.addText(`Delivery Date: ${new Date().toISOString().split('T')[0]}`, 30);
    documentProcessor.addText('Sincerely,', 30);
    documentProcessor.addText(`Name: ${clientData?.clientUser?.firstName} ${clientData?.clientUser?.lastName}`, 20);

    if (senderSignUrl) {
        documentProcessor.addImage(
            senderSignUrl,
            documentProcessor.width - 170,
            documentProcessor.currentY - 20,
            100,
            80
        );
    }
    documentProcessor.addLine(
        documentProcessor.width - 200,
        documentProcessor.currentY,
        documentProcessor.width - 50,
        documentProcessor.currentY
    );

    documentProcessor.addText('To:', 60);
    documentProcessor.addText('Name: BiteDevelopment', 20);
    if (receiverSignUrl) {
        documentProcessor.addImage(
            receiverSignUrl,
            documentProcessor.width - 170,
            documentProcessor.currentY - 20,
            100,
            80
        );
    }
    documentProcessor.addLine(
        documentProcessor.width - 200,
        documentProcessor.currentY,
        documentProcessor.width - 50,
        documentProcessor.currentY
    );

    return documentProcessor.getFile(`document${Date.now()}.pdf`);
};

class DocumentProcessor {
    #documentPdf = new jsPDF();
    #rightMargin;
    #currentY;
    #width;
    #height;

    constructor(params = {
        page: {
            orientation: "p",
            unit: "pt",
            format: "letter",
        },
        margins: {
            right: 10
        }
    }) {
        this.createDocument(params.page);

        this.#rightMargin = params.margins.right;
        this.#currentY = 0;
        this.#height = this.#documentPdf?.internal.pageSize.getHeight();
        this.#width = this.#documentPdf?.internal.pageSize.getWidth();
    }

    get rightMargin() {
        return this.#rightMargin;
    }
    get currentY() {
        return this.#currentY;
    }
    get height() {
        return this.#height;
    }
    get width() {
        return this.#width;
    }

    createDocument = (params = {
        orientation: "p",
        unit: "pt",
        format: "letter"
    }) => {
        const document = new jsPDF(params);
        document.setFontSize(12);
        document.setPage(1);
        this.#documentPdf = document;
    }

    addText = (text, newMargin) => {
        this.#currentY += newMargin;
        if (this.#currentY >= this.#height) {
            this.#documentPdf.addPage('letter');
            const pagesAmount = this.#documentPdf.getNumberOfPages();
            this.#documentPdf.setPage(pagesAmount + 1);
            this.#currentY = newMargin;
        }
        this.#documentPdf.text(
            this.#documentPdf.splitTextToSize(
                text,
                this.#width - this.#rightMargin
            ),
            this.#rightMargin, this.#currentY
        );
    };

    addTable = (body = [], header = [[]], lineColor = [0, 0, 0]) => {
        let tableHeight = 0;

        autoTable(this.#documentPdf, {
            theme: 'grid',
            head: header,
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineColor: lineColor,
                lineWidth: 1,
                cellPadding: 2,
                fontSize: 12,
                fontStyle: 'normal'
            },
            startY: this.#currentY + 25,
            body: body,
            didDrawPage: (data) => {
                tableHeight = data.cursor.y;
            }
        });
        this.#currentY = Math.round(tableHeight);
    };

    addImage = (imageUrl, x, y, w, h) => {
        this.#documentPdf.addImage(imageUrl, x, y, w, h);
    };

    addLine = (x1, y1, x2, y2) => {
        this.#documentPdf.line(x1, y1, x2, y2);
    };

    getFile = (fileName) => {
        return new File([this.#documentPdf.output('blob')], fileName);
    };
}