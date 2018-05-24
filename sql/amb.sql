--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: categorical; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE categorical (
    post_id uuid NOT NULL,
    topic character(30) NOT NULL
);


ALTER TABLE categorical OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE comments (
    comment_id uuid NOT NULL,
    post_id uuid,
    content character varying,
    created_time timestamp with time zone,
    signature character varying
);


ALTER TABLE comments OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE posts (
    post_id uuid NOT NULL,
    title character varying NOT NULL,
    content character varying NOT NULL,
    created_time timestamp with time zone NOT NULL,
    "like" bigint DEFAULT 0,
    dislike bigint DEFAULT 0,
    popularity bigint DEFAULT 0
);


ALTER TABLE posts OWNER TO postgres;

--
-- Name: user_comment_histories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE user_comment_histories (
    user_id uuid NOT NULL,
    comment_id uuid NOT NULL
);


ALTER TABLE user_comment_histories OWNER TO postgres;

--
-- Name: user_post_histories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE user_post_histories (
    user_id uuid NOT NULL,
    post_id uuid NOT NULL
);


ALTER TABLE user_post_histories OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    user_id uuid DEFAULT uuid_generate_v4() NOT NULL,
    account character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE users OWNER TO postgres;

--
-- Data for Name: categorical; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY categorical (post_id, topic) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY comments (comment_id, post_id, content, created_time, signature) FROM stdin;
7fce2e41-ecbe-406c-a6a2-37f8904cf915	8ab6758e-2cb6-4cbf-857c-fcabfa5470a4	content test	2018-05-22 21:39:41.743+08	signature test
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY posts (post_id, title, content, created_time, "like", dislike, popularity) FROM stdin;
e17b8c4e-a4ca-4305-914b-0477ec475a53	title test	DataTypes.STRING	2018-05-22 21:08:08.602+08	20	30	50
8ab6758e-2cb6-4cbf-857c-fcabfa5470a4	title test	DataTypes.STRING	2018-05-22 21:30:21.333+08	20	30	50
e4e5f584-1c1a-4809-96e4-7e6da94958d3	title test	DataTypes.STRING	2018-05-22 21:30:25.407+08	20	30	50
\.


--
-- Data for Name: user_comment_histories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY user_comment_histories (user_id, comment_id) FROM stdin;
28e22b97-d4c6-48fc-a087-192fc71ca878	7fce2e41-ecbe-406c-a6a2-37f8904cf915
\.


--
-- Data for Name: user_post_histories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY user_post_histories (user_id, post_id) FROM stdin;
28e22b97-d4c6-48fc-a087-192fc71ca878	8ab6758e-2cb6-4cbf-857c-fcabfa5470a4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (user_id, account, password) FROM stdin;
28e22b97-d4c6-48fc-a087-192fc71ca878	test	DataTypes.STRING
dcb5515b-9f31-4c4a-ad0a-4e9675137968	test2	DataTypes.STRING
3f5830b2-02bd-4a63-9aee-543973d57963	account test	password test
151729aa-c2e6-4d0a-b242-dc7ed53d5664	account test2	0800a3fb10c6d1252ec5fb14c98d52367954d01c2b3cb8cb89c4af8ac4ac6c15
b6cb75aa-f751-4d6b-b90f-289b88c0be24	account test3	0800a3fb10c6d1252ec5fb14c98d52367954d01c2b3cb8cb89c4af8ac4ac6c15
2b065f56-0a45-4888-a86e-34e9e4727b78	account test4	565b8169a0edb176bc3ef8ffc7e93fdfa54c23066af50384c17c0518263050bd
\.


--
-- Name: users account; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT account UNIQUE (account);


--
-- Name: categorical categorical_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY categorical
    ADD CONSTRAINT categorical_pkey PRIMARY KEY (post_id, topic);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (post_id);


--
-- Name: user_comment_histories user_comment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_comment_histories
    ADD CONSTRAINT user_comment_history_pkey PRIMARY KEY (comment_id, user_id);


--
-- Name: user_post_histories user_post_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_post_histories
    ADD CONSTRAINT user_post_history_pkey PRIMARY KEY (user_id, post_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: categorical categorical_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY categorical
    ADD CONSTRAINT categorical_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(post_id);


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(post_id);


--
-- Name: user_comment_histories user_comment_history_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_comment_histories
    ADD CONSTRAINT user_comment_history_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES comments(comment_id);


--
-- Name: user_comment_histories user_comment_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_comment_histories
    ADD CONSTRAINT user_comment_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);


--
-- Name: user_post_histories user_post_history_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_post_histories
    ADD CONSTRAINT user_post_history_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(post_id);


--
-- Name: user_post_histories user_post_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_post_histories
    ADD CONSTRAINT user_post_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);


--
-- PostgreSQL database dump complete
--

