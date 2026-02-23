import Accordion from 'react-bootstrap/Accordion'
import AddOverlookForm from './AddOverlookForm';


function AccordionForOverlookForm() {
 
  return (
    <>
      <Accordion >
        <Accordion.Item eventKey="0">
          <Accordion.Header >Add Overlooks</Accordion.Header>
          <Accordion.Body>
            <AddOverlookForm />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
    </>
  );
}

export default AccordionForOverlookForm;