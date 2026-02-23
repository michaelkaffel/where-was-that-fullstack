import AddCampsiteForm from './AddCampsiteForm';
import Accordion from 'react-bootstrap/Accordion';




function AccordionForCampsiteForm() {
 

  return (
    <>
      <Accordion >
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add Campsite</Accordion.Header>
          <Accordion.Body>
            <AddCampsiteForm />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
    </>
  );
}

export default AccordionForCampsiteForm;