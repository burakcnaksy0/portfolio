CREATE TABLE project_images (
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL
);

INSERT INTO project_images (project_id, image_url)
SELECT id, image_url FROM projects WHERE image_url IS NOT NULL AND image_url != '';

ALTER TABLE projects DROP COLUMN image_url;
