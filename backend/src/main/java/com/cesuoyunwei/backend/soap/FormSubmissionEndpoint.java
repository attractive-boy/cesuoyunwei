package com.cesuoyunwei.backend.soap;

import com.cesuoyunwei.backend.model.FormSubmission;
import com.cesuoyunwei.backend.repository.FormSubmissionRepository;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Endpoint
public class FormSubmissionEndpoint {
    private static final String NAMESPACE = "http://cesuoyunwei.com/forms";
    private final FormSubmissionRepository repo;

    public FormSubmissionEndpoint(FormSubmissionRepository repo) { this.repo = repo; }

    @PayloadRoot(namespace = NAMESPACE, localPart = "SubmitFormRequest")
    @ResponsePayload
    public SubmitFormResponse submit(@RequestPayload SubmitFormRequest req) {
        FormSubmission s = new FormSubmission();
        s.setTemplateId(req.templateId);
        s.setDataJson(req.dataJson);
        s.setSubmitterId(req.submitterId);
        FormSubmission saved = repo.save(s);
        SubmitFormResponse resp = new SubmitFormResponse();
        resp.submissionId = saved.getId();
        return resp;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "GetSubmissionRequest")
    @ResponsePayload
    public GetSubmissionResponse getSubmission(@RequestPayload GetSubmissionRequest req) {
        var opt = repo.findById(req.id);
        GetSubmissionResponse r = new GetSubmissionResponse();
        if (opt.isPresent()) {
            FormSubmission s = opt.get();
            r.id = s.getId();
            r.templateId = s.getTemplateId();
            r.dataJson = s.getDataJson();
            r.submitterId = s.getSubmitterId();
            r.createdAt = s.getCreatedAt().toString();
        }
        return r;
    }
}
