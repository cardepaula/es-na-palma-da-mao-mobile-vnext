import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FormBase } from '@espm/core';
import { DocumentoNatureza } from '../../state';

@Component({
  selector: 'edocs-documents-to-send-doc-form',
  templateUrl: './documents-to-send-doc-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsToSendBasicFormComponent extends FormBase implements OnInit, OnChanges, OnDestroy {

  validationMessages = {
    file: {
      required: 'Obrigatório'
    },
    name: {
      required: 'Obrigatório'
    },
    documentType: {
      required: 'Obrigatório'
    },
    documentPaperType: {
      required: 'Obrigatório'
    },
    documentAssignType: {
      required: 'Obrigatório'
    }
  };

  @Input() file: string;

  roleOptions = {
    title: 'Cargo / Função',
    subTitle: 'Selecione o cargo ou a função que deseja capturar e encaminhar o documento atual'
  }
  documentTypeOptions = {
    title: 'Tipo de documento',
    subTitle: 'Selecione o tipo do documento atual'
  }
  documentPaperTypeOptions = {
    title: 'Documento em papel',
    subTitle: 'Selecione como o documento em papel foi tirado foto ou escaneado'
  }
  documentAssignTypeOptions = {
    title: 'Tipo de assinatura',
    subTitle: 'Selecione o tipo de assinatura para o documento atual'
  }
  name: string = '';
  role: string = '';
  documentType: number = NaN;
  documentPaperType: number = NaN;
  documentAssignType: number = NaN;

  private subscription: Subscription;

  constructor(formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {
    super(formBuilder);
  }

  ngOnInit(): void {
    this.subscription = this.form.get('documentType').valueChanges
      .subscribe((value: number) => {
        const documentPaperType = this.form.get('documentPaperType');
        const documentAssignType = this.form.get('documentAssignType');
        documentPaperType.clearValidators();
        documentAssignType.clearValidators();
        documentPaperType.reset(null);
        documentAssignType.reset(null);
        if (value === DocumentoNatureza.Natodigital) { // Documento Eletrônico
          documentAssignType.setValidators([Validators.required]);
        } else if (value === DocumentoNatureza.Digitalizado) { // Documento Escaneado
          documentPaperType.setValidators([Validators.required]);
        }
        this.selectChange();
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('file' in changes) {
      const file: string = changes['file'].currentValue;
      if (file) {
        this.form.reset({ file });
      }
    }
  }

  isValidNumber(value: any) {
    return typeof value === 'number' && !isNaN(value)
  }

  selectChange(): void {
    console.log('Form: ', this.form)
    this.cdr.detectChanges()
  }

  protected createFormModel(): FormGroup {
    return this.formBuilder.group({
      file: ['', [Validators.required]],
      name: ['', [Validators.required]],
      documentType: [{value: 2, disabled: true}],
      documentPaperType: [null, []],
      documentAssignType: [null, []]
    });
  }

  protected prepareFormModel(formModel: any) {
    const model = super.prepareFormModel(formModel);
    if (model.documentType === 0) {
      delete model.documentPaperType;
    } else if (model.documentType === 1) {
      delete model.documentAssignType;
    }
    return model;
  }
}
