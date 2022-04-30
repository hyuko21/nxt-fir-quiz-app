import { FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useField } from "formik";

type FieldAutoCompleteProps = {
  id: string
  label?: string
  placeholder?: string
  name: string;
  items: any[],
  onSelect: (item: any) => void
  isDisabled?: boolean
  shouldValidate?: boolean
}

export const FieldAutoComplete: React.FC<FieldAutoCompleteProps> = ({
  id,
  label,
  placeholder,
  name,
  items,
  onSelect,
  isDisabled,
  shouldValidate
}) => {
  shouldValidate ??= false
  const [field, meta, { setValue }] = useField({ id, name, placeholder })
  return (
    <FormControl
      isInvalid={shouldValidate && meta.error && meta.touched}
      isDisabled={isDisabled}
    >
      <CUIAutoComplete
        items={items}
        label={label}
        labelStyleProps={{fontSize: 'lg',marginBottom:0}}
        placeholder={placeholder}
        hideToggleButton
        renderCustomInput={(inputProps) => (
          <Input
            {...inputProps}
            {...field}
            onChange={(e) => { inputProps.onChange(e); field.onChange(e) }}
            onBlur={(e) => { inputProps.onBlur(e); field.onBlur(e) }}
            id={id}
          />
        )}
        selectedItems={[]}
        listStyleProps={{position: 'absolute', zIndex: '9999'}}
        disableCreateItem
        onSelectedItemsChange={(changes) => {
          const nextSelected = changes.selectedItems[0]
          if (nextSelected?.label !== field.value) {
            setValue(nextSelected?.label)
            onSelect(nextSelected)
          }
        }}
      />
      {shouldValidate && <FormErrorMessage mt={-4} mb={4}>{meta.error}</FormErrorMessage>}
    </FormControl>
  )
}